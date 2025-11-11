import type { Request,Response,NextFunction } from "express";
import { asyncHandler } from "./asyncHandler.middleware.js"
import { ApiError } from "../utils/ApiError.js";
import { verifyJwt } from "../utils/jwt.js";
import type { JwtPayload } from "jsonwebtoken";
import { findDeletedToken, findUserById } from "../utils/db.utils.js";



export const authUser = asyncHandler(
    async(req:Request, _res:Response,next:NextFunction)=>{
        const token = req.cookies.token  || req.headers.authorization?.split(" ")[1]

        if(!token){
            throw new ApiError(401,"Unauthorized User")
        }

        const isBlackListedToken = await findDeletedToken(token);
        if(isBlackListedToken){
            throw new ApiError(401,"Unauthorized: Token is invalid or has been revoked. Please log in again.")
        }

        const decoded = verifyJwt(token) as JwtPayload;
        if(!decoded || !decoded.id){
            throw new ApiError(401,"Unauthorized User invalid token")
        }


        const user = await findUserById(decoded.id);
        if(!user){
            throw new ApiError(401,"Unauthorized User not found")

        }

        req.user = user;
        next();
    
    }
)