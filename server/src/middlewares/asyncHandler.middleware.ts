import type { Request,Response,NextFunction } from "express";
type asyncFunction = (req:Request,res:Response,next:NextFunction) => Promise<void>;
export const asyncHandler = (fn:asyncFunction) => (req:Request,res:Response,next:NextFunction)=>{
    Promise.resolve(fn(req,res,next)).catch(next);
} 
