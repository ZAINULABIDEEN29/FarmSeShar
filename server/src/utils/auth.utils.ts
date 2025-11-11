import jwt from "jsonwebtoken";
import { signJwt } from "./jwt.js";

export const generateAccessToken = (userId: string) => {
  return signJwt({ id: userId });
};

export const generateRefreshToken = (userId: string) => {
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET as string, {
    expiresIn: "7d",
  });
};
