import type { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware.js";
import { updateFarmerProfileService } from "../services/farmerProfile.service.js";
import { ApiError } from "../utils/ApiError.js";
import type { UpdateFarmerProfileInput } from "../validator/farmer.schema.js";

export const updateFarmerProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const farmerId = req.farmer?._id?.toString();
    
    if (!farmerId) {
      throw new ApiError(401, "Unauthorized: Farmer not authenticated");
    }

    const input: UpdateFarmerProfileInput = req.body;
    const updatedFarmer = await updateFarmerProfileService(farmerId, input);

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      farmer: updatedFarmer,
    });
  }
);

