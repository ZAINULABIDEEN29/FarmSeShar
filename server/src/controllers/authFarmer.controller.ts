import type { Request,Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware.js";
import { findFarmerByEmail, findFarmerById } from "../utils/farmers.utils.js";
import { ApiError } from "../utils/ApiError.js";
import { sendVerificationEmail } from "../helpers/sendVerificationEmail.js";
import { registerFarmerService } from "../services/farmer.service.js";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/auth.utils.js";
import Token from "../models/blackListToken.model.js";
import crypto from "crypto";
import { sendResetPasswordEmail } from "../helpers/sendResetPasswordEmail.js";





export const registerFarmer = asyncHandler(
    async (req:Request, res:Response):Promise<any> => {
        const {fullName, cnic,email, phoneNumber , farmName,farmLocation,farmDescription,accountHolderName,bankAccountNumber,password} = req.body;

        const farmer = await findFarmerByEmail(email,true);
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        const verifyCodeExpire = new Date(Date.now() + 3600000);

        if(farmer && farmer.isVerified){
            throw new ApiError(400,"Farmer already exists")
        }
        if(farmer && !farmer.isVerified){
            farmer.verifyCode = verifyCode;
            farmer.verifyCodeExpire = verifyCodeExpire;
            await farmer.save();

               const emailResponse = await sendVerificationEmail(email,fullName.firstName,verifyCode);
               if(!emailResponse.success){
                throw new ApiError(400,emailResponse.message)
               }

               return res.status(200).json({
                success:true,
                message:"Verification code resent. Please verify your email."
               })

        }

        const farmerRegistered = await registerFarmerService({
            firstName:fullName.firstName,
            lastName:fullName.lastName,
            cnic,
            email,
            phoneNumber,
            farmName,
            farmLocation,
            farmDescription,
            accountHolderName,
            bankAccountNumber,
            verifyCode,
            verifyCodeExpire:verifyCodeExpire,
            isVerified:false,
            password
        })

     // No tokens needed for registration - farmer must verify email first
     const emailResponse = await sendVerificationEmail(email,fullName.firstName,verifyCode)
     if(!emailResponse.success){
        throw new ApiError(400,emailResponse.message)
     }
     const {password:_,...farmerResponse} = farmerRegistered.toObject();

     res.status(201).json({
        success:true,
        message:"Farmer registered successfully. Please verify your email.",
        farmer:farmerResponse
     })


    }

)


export const verifyCodeForFarmer = asyncHandler(
    async(req:Request, res:Response):Promise<any>=>{
        const {farmerId, code} = req.body;
        
        if(!farmerId || !code){
            throw new ApiError(400,"All fields are required")
        }
        const farmerFound = await findFarmerById(farmerId);
        if(!farmerFound){
            throw new ApiError(404,"Farmer not found")
        }
        if(farmerFound.isVerified){
            throw new ApiError(400,"Farmer already verified")
        }
        if(farmerFound.verifyCode !== code){
            throw new ApiError(400,"Invalid code")
        }
        if(!farmerFound.verifyCodeExpire || farmerFound.verifyCodeExpire < new Date()){
            throw new ApiError(400,"Code expired")
        }
        farmerFound.isVerified = true;
        farmerFound.verifyCode = undefined;
        farmerFound.verifyCodeExpire = undefined;
        await farmerFound.save();
        return res.status(200).json({
            success:true,
            message:"Farmer verified successfully"
        })
    }
)

export const loginFarmer =asyncHandler(
    async (req:Request, res:Response):Promise<any>=>{
        const {email,password} = req.body;
        const farmer = await findFarmerByEmail(email,true);
        if(!farmer){
            throw new ApiError(404,"Invalid credentials")
        }

        const isMatch = await farmer.comparePassword(password);
        if(!isMatch){
            throw new ApiError(400,"Invalid credentials")
        }

        const accessToken = generateAccessToken(farmer._id.toString());
        const refreshToken = generateRefreshToken(farmer._id.toString());
        farmer.refreshToken = refreshToken;
        await farmer.save();
        
        const { password: _, refreshToken: __, ...farmerResponse } = farmer.toObject();
        
        const isProduction = process.env.NODE_ENV === "production";
        // Cookie options for secure HTTP-only cookies
        const cookieOptions = {
          httpOnly: true,
          secure: isProduction,
          sameSite: isProduction ? ("strict" as const) : ("lax" as const),
        };

        // Store both tokens in HTTP-only cookies (secure, not accessible to JavaScript)
        // This prevents XSS attacks as tokens cannot be accessed via JavaScript
        return res
          .status(200)
          .cookie("accessToken", accessToken, {
            ...cookieOptions,
            maxAge: 24 * 60 * 60 * 1000, // 1 day for access token
          })
          .cookie("refreshToken", refreshToken, {
            ...cookieOptions,
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days for refresh token
          })
          .json({
            message: "Login successful",
            farmer: farmerResponse,
            // Tokens are in HTTP-only cookies, not exposed to JavaScript
          });
    }
    
)

export const forgotPasswordFarmer = asyncHandler(
    async (req:Request, res:Response):Promise<any>=>{
        const {email} = req.body;
        if(!email){
            throw new ApiError(400,"Email is required")
        }

        const farmerFound = await findFarmerByEmail(email,true);
        if(!farmerFound){
            throw new ApiError(404,"Farmer not found")
        }
        const resetToken = crypto.randomBytes(32).toString("hex");
        farmerFound.resetPasswordToken = resetToken;
         farmerFound.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000);
        await farmerFound.save();

        const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
        const resetLink = `${clientUrl}/farmer-reset-password?token=${resetToken}&farmerId=${farmerFound._id}`;
        
        const emailResponse = await sendResetPasswordEmail(
            farmerFound.email,
            farmerFound.fullName.firstName,
            resetLink
        )

        if(!emailResponse.success){
            throw new ApiError(500,"Failed to send reset password email")
        }
        
        return res.status(200).json({
            success:true,
            message:"Password reset link sent to your email"
        })
    }
)

export const resetPasswordFarmer = asyncHandler(
    async (req:Request, res:Response):Promise<any>=>{
        const {farmerId,token,newPassword} = req.body;

        if(!farmerId || !token || !newPassword){
            throw new ApiError(400,"All fields are required")
        }
        const farmerFound = await findFarmerById(farmerId);
        if(!farmerFound){
            throw new ApiError(404,"Farmer not found")
        }

        if(!farmerFound.resetPasswordExpire || farmerFound.resetPasswordExpire < new Date){
            throw new ApiError(400,"Reset token is invalid or expired")
        }
        if(!farmerFound.resetPasswordToken){
            throw new ApiError(400,"Reset token not found")
        }
        if(farmerFound.resetPasswordToken !== token){
            throw new ApiError(400,"Invalid reset token")
        }

        farmerFound.password = newPassword;
        farmerFound.resetPasswordToken = undefined;
        farmerFound.resetPasswordExpire = undefined;
        await farmerFound.save();

        return res.status(200).json({
            success:true,
            message:"Password reset successfully. You can now log in."
        })
    }
)

export const refreshTokenFarmer = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    // Refresh token is sent via HTTP-only cookie
    const refreshToken = req.cookies.refreshToken;

    // If no refresh token, return success: false (not an error - farmer is just not logged in)
    // Return 200 with success: false to match user refresh endpoint behavior
    if (!refreshToken) {
      return res.status(200).json({
        success: false,
        message: "No refresh token provided",
      });
    }

    // Verify refresh token
    let decoded: any;
    try {
      decoded = verifyRefreshToken(refreshToken) as any;
      if (!decoded || !decoded.id) {
        return res.status(200).json({
          success: false,
          message: "Invalid refresh token",
        });
      }
    } catch (error) {
      // Token verification failed (expired or invalid)
      return res.status(200).json({
        success: false,
        message: "Invalid or expired refresh token",
      });
    }

    // Find farmer and verify refresh token matches stored one
    const farmer = await findFarmerById(decoded.id);
    if (!farmer || !farmer.refreshToken || farmer.refreshToken !== refreshToken) {
      return res.status(200).json({
        success: false,
        message: "Invalid refresh token",
      });
    }

    // Generate new access token
    const newAccessToken = generateAccessToken(farmer._id.toString());

    // Optionally rotate refresh token for better security
    const newRefreshToken = generateRefreshToken(farmer._id.toString());
    farmer.refreshToken = newRefreshToken;
    await farmer.save();

    const isProduction = process.env.NODE_ENV === "production";
    const cookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? ("strict" as const) : ("lax" as const),
    };

    const { password: _, refreshToken: __, ...farmerResponse } = farmer.toObject();

    // Store both new tokens in HTTP-only cookies
    return res
      .status(200)
      .cookie("accessToken", newAccessToken, {
        ...cookieOptions,
        maxAge: 24 * 60 * 60 * 1000, // 1 day for access token
      })
      .cookie("refreshToken", newRefreshToken, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days for refresh token
      })
      .json({
        success: true,
        farmer: farmerResponse,
        // Tokens are in HTTP-only cookies, not exposed to JavaScript
      });
  }
);

export const getFarmer = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    res.status(200).json({
      success: true,
      farmer: req.farmer,
    });
  }
);
export const logoutFarmer = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;
    
    // Blacklist both tokens
    if (accessToken) {
      await Token.create({ token: accessToken });
    }
    if (refreshToken) {
      await Token.create({ token: refreshToken });
    }

    const isProduction = process.env.NODE_ENV === "production";
    const cookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? ("strict" as const) : ("lax" as const),
    };

    // Clear both token cookies
    res.clearCookie("accessToken", cookieOptions);
    res.clearCookie("refreshToken", cookieOptions);

    return res.status(200).json({
      success: true,
      message: "Farmer logged out successfully",
    });
  }
);