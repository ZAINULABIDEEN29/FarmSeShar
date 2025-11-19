import  { z,ZodError } from "zod";
import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError.js";
export const validate =
  (schema: z.ZodType<any>, source: "body" | "query" = "body") =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      if (source === "query") {
        const processedQuery: any = {};
        for (const [key, value] of Object.entries(req.query)) {
          processedQuery[key] = value === "" ? undefined : value;
        }
        const validateData = schema.parse(processedQuery);
        Object.assign(req.query, validateData);
      } else {
        if(!req.body || Object.keys(req.body).length === 0){
          throw new ApiError(400,"Request body is required")
        }
        const validateData = schema.parse(req.body);
        req.body = validateData;
      }
      next();
    } catch (error: any) {
       if (error instanceof ZodError) {
            const errorDetails = error.issues.map((err: z.ZodIssue) => ({
                    field: err.path.join('.'),
                    message: err.message
                }));
            console.error("Validation error:", {
                path: req.path,
                method: req.method,
                errors: errorDetails,
                body: req.body
            });
            return res.status(400).json({
                success: false,
                message:"Validation Failed",
                errors: errorDetails
            });
        }
        console.error("Validation middleware error:", {
            path: req.path,
            method: req.method,
            error: error.message,
            body: req.body
        });
        return res.status(400).json({
            success: false,
            message:"Validation Failed",
            error: error.message
        });
    }
  };
