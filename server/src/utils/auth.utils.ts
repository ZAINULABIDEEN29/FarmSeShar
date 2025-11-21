import jwt from "jsonwebtoken";
import { signJwt } from "./jwt.js";
import { ApiError } from "./ApiError.js";
export const generateAccessToken = (userId: string) => {
  return signJwt({ id: userId });
};
export const generateRefreshToken = (userId: string) => {
  const refreshSecret = process.env.JWT_REFRESH_SECRET;
  if (!refreshSecret) {
    throw new Error("JWT_REFRESH_SECRET is not set");
  }
  return jwt.sign({ id: userId }, refreshSecret, {
    expiresIn: "7d",
  });
};


export const verifyRefreshToken = (token: string) => {
  try {
    const refreshSecret = process.env.JWT_REFRESH_SECRET;
    if (!refreshSecret) {
      throw new Error("JWT_REFRESH_SECRET is not set");
    }
    return jwt.verify(token, refreshSecret);
  } catch (error: any) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new ApiError(401, "Refresh token has expired");
    }
    throw new ApiError(401, `Invalid refresh token: ${error.message}`);
  }
};
