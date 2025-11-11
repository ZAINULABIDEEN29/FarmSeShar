import { asyncHandler } from "../middlewares/asyncHandler.middleware.js";
import type { Request, Response } from "express";
import { findUserByEmail, findUserById } from "../utils/db.utils.js";
import { ApiError } from "../utils/ApiError.js";
import { registerService } from "../services/user.service.js";
import { generateAccessToken, generateRefreshToken } from "../utils/auth.utils.js";
import blackListTokenModel from "../models/blackListToken.model.js"
import { sendVerificationEmail } from "../helpers/sendVerificationEmail.js";
import {sendResetPasswordEmail} from "../helpers/sendResetPasswordEmail.js";
import crypto from "crypto";
import bcrypt from "bcryptjs";



export const registerUser = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const { fullName, email, phoneNumber, password } = req.body;

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString(); 
    const expiryDate = new Date(Date.now() + 3600000); 

    let user = await findUserByEmail(email);

    
    if (user && user.isVerified) {
      throw new ApiError(400, "User already exists");
    }

    
    if (user && !user.isVerified) {
      user.verifyCode = verifyCode;
      user.verifyCodeExpire = expiryDate;
      await user.save();

      const emailResponse = await sendVerificationEmail(
        email,
        fullName.firstName,
        verifyCode
      );

      if (!emailResponse.success) {
        throw new ApiError(400, emailResponse.message);
      }

      return res.status(200).json({
        success: true,
        message: "Verification code resent. Please verify your email."
      });
    }


    user = await registerService({
      firstName: fullName.firstName,
      lastName: fullName.lastName,
      email,
      phoneNumber,
      password,
      verifyCode,
      verifyCodeExpire: expiryDate,
      isVerified: false
    });

 
    const token = generateAccessToken(user._id.toString());
    res.cookie("token", token, { httpOnly: true });


    const emailResponse = await sendVerificationEmail(
      email,
      fullName.firstName,
      verifyCode
    );

    if (!emailResponse.success) {
      throw new ApiError(400, emailResponse.message);
    }

   
    const { password: _, ...userResponse } = user.toObject();

    return res.status(201).json({
      success: true,
      message: "User registered successfully. Please verify your email.",
      user: userResponse
    });
  }
);
export const verifyOtp = asyncHandler(
    async (req: Request, res: Response):Promise<any> => {
  
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    
    if (user.verifyCodeExpire && user.verifyCodeExpire < new Date()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    if (String(user.verifyCode) !== String(otp)) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    
    user.isVerified = true;
    user.verifyCode = undefined;
    user.verifyCodeExpire = undefined;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Account verified successfully",
    });
}
)

export const forgotPassword = asyncHandler(
  async (req: Request, res: Response):Promise<any> => {
    const { email } = req.body;

    if (!email) {
      throw new ApiError(400, "Email is required");
    }

    const user = await findUserByEmail(email);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

   
    const resetToken = crypto.randomBytes(32).toString("hex");

   
    const hashedToken = await bcrypt.hash(resetToken, 10);

    
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

   
    const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}&id=${user._id}`;

    const emailResponse = await sendResetPasswordEmail(
      user.email,
      user.fullName.firstName,
      `Use this link to reset your password: ${resetLink}`
    );

    if (!emailResponse.success) {
      throw new ApiError(500, "Failed to send reset password email");
    }

    return res.status(200).json({
      success: true,
      message: "Password reset link sent to your email",
    });
  }
);

export const resetPassword = asyncHandler(
  async (req: Request, res: Response):Promise<any> => {
    const { userId, token, newPassword } = req.body;

    if (!userId || !token || !newPassword) {
      throw new ApiError(400, "All fields are required");
    }

    const user = await findUserById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

  
    if (!user.resetPasswordToken || !user.resetPasswordExpire || user.resetPasswordExpire < new Date()) {
      throw new ApiError(400, "Reset token is invalid or expired");
    }

 
    const isValid = await bcrypt.compare(token, user.resetPasswordToken);
    if (!isValid) {
      throw new ApiError(400, "Invalid reset token");
    }


    user.password = newPassword;
    user.resetPasswordToken = undefined!;
    user.resetPasswordExpire = undefined!;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successfully. You can now log in.",
    });
  }
);

export const loginUser = asyncHandler(
    async (req: Request, res: Response):Promise<any> => {

    const { email, password } = req.body;
    
    
    const user = await findUserByEmail(email, true);
    if (!user) {
      throw new ApiError(404, "Invalid credentials");
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new ApiError(400, "Invalid credentials");
    }

    const accessToken = generateAccessToken(user._id.toString()) ;
    const refreshToken = generateRefreshToken(user._id.toString());

    user.refreshToken = refreshToken;
    await user.save();

   
    const { password: _, ...userResponse } = user.toObject();

    return res.status(200).cookie("token", accessToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production' }).json({
      message: "Login successful",
      refreshToken,
      user: userResponse,
    });
  
}
)

export const getUser = asyncHandler(
    async (req:Request, res:Response):Promise<any>=>{
         res.status(201).json({
            success:true,
            user:req.user
        })
    }
)

export const logoutUser = asyncHandler(
    async (req:Request, res:Response):Promise<any>=>{
        
        const token  = req.cookies.token || req.headers.authorization?.split(" ")[1];
         await blackListTokenModel.create({token})
         res.clearCookie("token");
        
         return res.status(200).json({
            success:true,
            message:"User logged out successfully",
           
        })
    }
)