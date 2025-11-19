import type { Request,Response,NextFunction } from "express";
import { asyncHandler } from "./asyncHandler.middleware.js"
import { ApiError } from "../utils/ApiError.js";
import { verifyJwt } from "../utils/jwt.js";
import type { JwtPayload } from "jsonwebtoken";
import { findDeletedToken, findUserById } from "../utils/db.utils.js";
import { findFarmerById } from "../utils/farmers.utils.js";
export const authUser = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
      throw new ApiError(401, "Unauthorized: No access token provided");
    }
    const isBlackListedToken = await findDeletedToken(accessToken);
    if (isBlackListedToken) {
      throw new ApiError(401, "Unauthorized: Token is invalid or has been revoked. Please log in again.");
    }
    const decoded = verifyJwt(accessToken) as JwtPayload;
    if (!decoded || !decoded.id) {
      throw new ApiError(401, "Unauthorized: Invalid token");
    }
    const user = await findUserById(decoded.id);
    if (!user) {
      throw new ApiError(401, "Unauthorized: User not found");
    }
    req.user = user;
    next();
  }
);
export const authFarmer = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
      throw new ApiError(401, "Unauthorized: No access token provided");
    }
    const isBlackListedToken = await findDeletedToken(accessToken);
    if (isBlackListedToken) {
      throw new ApiError(401, "Unauthorized: Token is invalid or has been revoked. Please log in again.");
    }
    const decoded = verifyJwt(accessToken) as JwtPayload;
    if (!decoded || !decoded.id) {
      throw new ApiError(401, "Unauthorized: Invalid token");
    }
    const farmer = await findFarmerById(decoded.id);
    if (!farmer) {
      throw new ApiError(401, "Unauthorized: Farmer not found");
    }
    req.farmer = farmer;
    next();
  }
);