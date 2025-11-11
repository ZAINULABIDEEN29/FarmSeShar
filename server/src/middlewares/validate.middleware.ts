import  { z,ZodError } from "zod";
import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError.js";

export const validate =
  (schema: z.ZodType<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {

      if(!req.body || Object.keys(req.body).length === 0){
        throw new ApiError(400,"Request body is required")
      }
     const validateData = schema.parse(req.body);
     req.body = validateData;
      next();
    } catch (error: any) {
      
       if (error instanceof ZodError) {
            return res.status(400).json({
                success: false,
                message:"Validation Failed",
                errors: error.issues.map((err: z.ZodIssue) => ({
                    field: err.path.join('.'),
                    message: err.message
                }))
            });
        }
        return res.status(400).json({
            success: false,
            message:"Validation Failed",
            error: error.message
        });
    }
  };
