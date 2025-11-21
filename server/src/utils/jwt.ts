import jwt from "jsonwebtoken";
import { ApiError } from "./ApiError.js";
import dotenv from "dotenv";
dotenv.config();
const SECRET = process.env.JWT_SECRET;


if (!SECRET) {
  throw new Error("JWT_SECRET is not set — set it in .env and restart the server");
}

export const signJwt = (payload: object) => {
  return jwt.sign(payload, SECRET, { expiresIn: "1d" });
};

export const verifyJwt = (token: string) => {
  try {
    return jwt.verify(token, SECRET);
  } catch (error: any) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new ApiError(401, "Token has expired");
    }
    throw new ApiError(401, `Invalid token: ${error.message}`);
  }
};
