import  { z,ZodError } from "zod";
import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError.js";

export const validate =
  (schema: z.ZodType<any>, source: "body" | "query" = "body") =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      if (source === "query") {
        // For query validation, preprocess empty strings to undefined
        const processedQuery: any = {};
        for (const [key, value] of Object.entries(req.query)) {
          processedQuery[key] = value === "" ? undefined : value;
        }
        // Parse and validate query parameters
        // Zod will coerce string values to numbers/booleans as needed
        const validateData = schema.parse(processedQuery);
        // Merge validated data back into req.query to preserve other query params
        Object.assign(req.query, validateData);
      } else {
        // For body validation, check if body exists
        if(!req.body || Object.keys(req.body).length === 0){
          throw new ApiError(400,"Request body is required")
        }
        const validateData = schema.parse(req.body);
        req.body = validateData;
      }
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
