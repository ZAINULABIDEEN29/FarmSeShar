import { v2 as cloudinary } from "cloudinary";
import { ApiError } from "./ApiError.js";


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface UploadResult {
  url: string;
  public_id: string;
  secure_url: string;
}

/**
 * Upload a single image to Cloudinary
 * @param filePath - Base64 string or file path
 * @param folder - Optional folder name in Cloudinary
 * @returns Upload result with URL and public_id
 */
export const uploadImage = async (
  filePath: string,
  folder: string = "farmers-app/products"
): Promise<UploadResult> => {
  try {
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      throw new ApiError(500, "Cloudinary configuration is missing");
    }

    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      resource_type: "image",
      transformation: [
        { width: 1200, height: 1200, crop: "limit", quality: "auto" },
        { fetch_format: "auto" },
      ],
    });

    return {
      url: result.url,
      secure_url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (error: any) {
    console.error("Cloudinary upload error:", error);
    throw new ApiError(500, `Failed to upload image: ${error.message}`);
  }
};

/**
 * Upload multiple images to Cloudinary
 * @param files - Array of base64 strings or file paths
 * @param folder - Optional folder name in Cloudinary
 * @returns Array of upload results
 */
export const uploadMultipleImages = async (
  files: string[],
  folder: string = "farmers-app/products"
): Promise<UploadResult[]> => {
  try {
    const uploadPromises = files.map((file) => uploadImage(file, folder));
    const results = await Promise.all(uploadPromises);
    return results;
  } catch (error: any) {
    console.error("Cloudinary multiple upload error:", error);
    throw new ApiError(500, `Failed to upload images: ${error.message}`);
  }
};

/**
 * Delete an image from Cloudinary
 * @param publicId - Public ID of the image to delete
 */
export const deleteImage = async (publicId: string): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error: any) {
    console.error("Cloudinary delete error:", error);
    throw new ApiError(500, `Failed to delete image: ${error.message}`);
  }
};

/**
 * Delete multiple images from Cloudinary
 * @param publicIds - Array of public IDs to delete
 */
export const deleteMultipleImages = async (publicIds: string[]): Promise<void> => {
  try {
    await cloudinary.api.delete_resources(publicIds);
  } catch (error: any) {
    console.error("Cloudinary multiple delete error:", error);
    throw new ApiError(500, `Failed to delete images: ${error.message}`);
  }
};

export default cloudinary;

