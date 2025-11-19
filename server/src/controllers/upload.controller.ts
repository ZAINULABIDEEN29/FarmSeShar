import type { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware.js";
import { uploadImage, uploadMultipleImages } from "../utils/cloudinary.js";
import { ApiError } from "../utils/ApiError.js";

/**
 * Upload a single image
 */
export const uploadSingleImage = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    if (!req.file) {
      throw new ApiError(400, "No image file provided");
    }

    // Convert buffer to base64
    const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

    const result = await uploadImage(base64Image);

    return res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      image: {
        url: result.secure_url,
        public_id: result.public_id,
      },
    });
  }
);

/**
 * Upload multiple images
 */
export const uploadMultipleImagesController = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    if (!req.files || (Array.isArray(req.files) && req.files.length === 0)) {
      throw new ApiError(400, "No image files provided");
    }

    const files = Array.isArray(req.files) ? req.files : [req.files];
    
    // Convert buffers to base64
    const base64Images = files.map((file) => 
      `data:${file.mimetype};base64,${file.buffer.toString("base64")}`
    );

    const results = await uploadMultipleImages(base64Images);

    return res.status(200).json({
      success: true,
      message: "Images uploaded successfully",
      images: results.map((result) => ({
        url: result.secure_url,
        public_id: result.public_id,
      })),
    });
  }
);

