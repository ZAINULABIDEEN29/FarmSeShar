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
                console.error("❌ Failed to resend verification email:", emailResponse.message);
                throw new ApiError(500,emailResponse.message)
               }
               console.log("✅ Verification email resent successfully to:", email);
               const {password:_,...farmerResponse} = farmer.toObject();
               return res.status(200).json({
                success:true,
                message:"Verification code resent. Please verify your email.",
                farmer:farmerResponse
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
     const emailResponse = await sendVerificationEmail(email,fullName.firstName,verifyCode)
     if(!emailResponse.success){
        console.error("❌ Failed to send verification email:", emailResponse.message);
        throw new ApiError(500,emailResponse.message)
     }
     console.log("✅ Verification email sent successfully to:", email);
     const {password:_,...farmerResponse} = farmerRegistered.toObject();
     res.status(201).json({
        success:true,
        message:"Farmer registered successfully. Please verify your email.",
        farmer:farmerResponse
     })
    }
)
export const resendVerificationCodeForFarmer = asyncHandler(
    async(req:Request, res:Response):Promise<any>=>{
        const {email} = req.body;
        if(!email){
            throw new ApiError(400,"Email is required")
        }
        const farmerFound = await findFarmerByEmail(email,true);
        if(!farmerFound){
            throw new ApiError(404,"Farmer not found")
        }
        if(farmerFound.isVerified){
            throw new ApiError(400,"Farmer is already verified")
        }
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        const verifyCodeExpire = new Date(Date.now() + 3600000);
        farmerFound.verifyCode = verifyCode;
        farmerFound.verifyCodeExpire = verifyCodeExpire;
        await farmerFound.save();
        const emailResponse = await sendVerificationEmail(email,farmerFound.fullName.firstName,verifyCode);
        if(!emailResponse.success){
            console.error("❌ Failed to resend verification email:", emailResponse.message);
            throw new ApiError(500,emailResponse.message)
        }
        console.log("✅ Verification code resent successfully to:", email);
        return res.status(200).json({
            success:true,
            message:"Verification code resent. Please check your email."
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
        // Check if farmer is verified
        if(!farmer.isVerified){
            const { password: _, refreshToken: __, ...farmerResponse } = farmer.toObject();
            return res.status(200).json({
                success: false,
                message: "Please verify your email before logging in.",
                farmer: farmerResponse,
                requiresVerification: true
            });
        }
        const accessToken = generateAccessToken(farmer._id.toString());
        const refreshToken = generateRefreshToken(farmer._id.toString());
        farmer.refreshToken = refreshToken;
        await farmer.save();
        const { password: _, refreshToken: __, ...farmerResponse } = farmer.toObject();
        const isProduction = process.env.NODE_ENV === "production";
        const cookieOptions = {
          httpOnly: true,
          secure: isProduction,
          sameSite: isProduction ? ("strict" as const) : ("lax" as const),
        };
        return res
          .status(200)
          .cookie("accessToken", accessToken, {
            ...cookieOptions,
            maxAge: 24 * 60 * 60 * 1000,
          })
          .cookie("refreshToken", refreshToken, {
            ...cookieOptions,
            maxAge: 7 * 24 * 60 * 60 * 1000,
          })
          .json({
            message: "Login successful",
            farmer: farmerResponse,
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
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(200).json({
        success: false,
        message: "No refresh token provided",
      });
    }
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
      return res.status(200).json({
        success: false,
        message: "Invalid or expired refresh token",
      });
    }
    const farmer = await findFarmerById(decoded.id);
    if (!farmer || !farmer.refreshToken || farmer.refreshToken !== refreshToken) {
      return res.status(200).json({
        success: false,
        message: "Invalid refresh token",
      });
    }
    const newAccessToken = generateAccessToken(farmer._id.toString());
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
    return res
      .status(200)
      .cookie("accessToken", newAccessToken, {
        ...cookieOptions,
        maxAge: 24 * 60 * 60 * 1000,
      })
      .cookie("refreshToken", newRefreshToken, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({
        success: true,
        farmer: farmerResponse,
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
    res.clearCookie("accessToken", cookieOptions);
    res.clearCookie("refreshToken", cookieOptions);
    return res.status(200).json({
      success: true,
      message: "Farmer logged out successfully",
    });
  }
);