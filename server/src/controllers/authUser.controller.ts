import { asyncHandler } from "../middlewares/asyncHandler.middleware.js";
import type { Request, Response } from "express";
import { findUserByEmail, findUserById } from "../utils/db.utils.js";
import { ApiError } from "../utils/ApiError.js";
import { registerService } from "../services/user.service.js";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/auth.utils.js";
import blackListTokenModel from "../models/blackListToken.model.js"
import { sendVerificationEmail } from "../helpers/sendVerificationEmail.js";
import {sendResetPasswordEmail} from "../helpers/sendResetPasswordEmail.js";
import crypto from "crypto";
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
    const { userId, otp } = req.body;
    if (!userId || !otp) {
      throw new ApiError(400, "All fields are required");
    }
    const user = await findUserById(userId);
    if (!user) {
     throw new ApiError(404, "User not found");
    }
    if (user.isVerified) {
      throw new ApiError(400, "User already verified");
    }
     if (String(user.verifyCode) !== String(otp)) {
          throw new ApiError(400, "Invalid OTP");
    }
    if (!user.verifyCodeExpire || user.verifyCodeExpire < new Date()) {
      throw new ApiError(400, "OTP expired");
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
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();
    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
    const resetLink = `${clientUrl}/reset-password?token=${resetToken}&userId=${user._id}`;
    const emailResponse = await sendResetPasswordEmail(
      user.email,
      user.fullName.firstName,
      resetLink
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
    if (!user.resetPasswordExpire || user.resetPasswordExpire < new Date()) {
      throw new ApiError(400, "Reset token is invalid or expired");
    }
    if (!user.resetPasswordToken) {
      throw new ApiError(400, "Reset token not found");
    }
    if (user.resetPasswordToken !== token) {
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
    const accessToken = generateAccessToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());
    user.refreshToken = refreshToken;
    await user.save();
    const { password: _, refreshToken: __, ...userResponse } = user.toObject();
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
        maxAge: 15 * 60 * 1000,
      })
      .cookie("refreshToken", refreshToken, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({
        message: "Login successful",
        user: userResponse,
      });
}
)
export const refreshToken = asyncHandler(
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
    const user = await findUserById(decoded.id);
    if (!user || !user.refreshToken || user.refreshToken !== refreshToken) {
      return res.status(200).json({
        success: false,
        message: "Refresh token mismatch",
      });
    }
    const newAccessToken = generateAccessToken(user._id.toString());
    const newRefreshToken = generateRefreshToken(user._id.toString());
    user.refreshToken = newRefreshToken;
    await user.save();
    const isProduction = process.env.NODE_ENV === "production";
    const cookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? ("strict" as const) : ("lax" as const),
    };
    return res
      .status(200)
      .cookie("accessToken", newAccessToken, {
        ...cookieOptions,
        maxAge: 15 * 60 * 1000,
      })
      .cookie("refreshToken", newRefreshToken, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({
        success: true,
        user: {
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          isVerified: user.isVerified,
        },
      });
  }
);
export const getUser = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    res.status(200).json({
      success: true,
      user: req.user,
    });
  }
);
export const logoutUser = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;
    if (accessToken) {
      await blackListTokenModel.create({ token: accessToken });
    }
    if (refreshToken) {
      await blackListTokenModel.create({ token: refreshToken });
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
      message: "User logged out successfully",
    });
  }
);