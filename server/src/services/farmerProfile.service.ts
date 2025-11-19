import Farmer from "../models/farmer.model.js";
import { ApiError } from "../utils/ApiError.js";
import type { UpdateFarmerProfileInput } from "../validator/farmer.schema.js";
import mongoose from "mongoose";

export const updateFarmerProfileService = async (
  farmerId: string,
  input: UpdateFarmerProfileInput
) => {
  const farmer = await Farmer.findById(farmerId);
  
  if (!farmer) {
    throw new ApiError(404, "Farmer not found");
  }

  // Update fields if provided
  if (input.firstName !== undefined || input.lastName !== undefined) {
    farmer.fullName = {
      firstName: input.firstName ?? farmer.fullName.firstName,
      lastName: input.lastName ?? farmer.fullName.lastName,
    };
  }

  if (input.phoneNumber !== undefined) {
    // Check if phone number is already taken by another farmer
    const existingFarmer = await Farmer.findOne({
      phoneNumber: input.phoneNumber,
      _id: { $ne: new mongoose.Types.ObjectId(farmerId) },
    });
    if (existingFarmer) {
      throw new ApiError(409, "Phone number is already in use");
    }
    farmer.phoneNumber = input.phoneNumber;
  }

  if (input.farmName !== undefined) {
    farmer.farmName = input.farmName;
  }

  if (input.farmLocation !== undefined) {
    farmer.farmLocation = input.farmLocation;
  }

  if (input.farmDescription !== undefined) {
    farmer.farmDescription = input.farmDescription;
  }

  if (input.accountHolderName !== undefined) {
    farmer.accountHolderName = input.accountHolderName;
  }

  if (input.bankAccountNumber !== undefined) {
    farmer.bankAccountNumber = input.bankAccountNumber;
  }

  if (input.profileImage !== undefined) {
    farmer.profileImage = input.profileImage;
  }

  await farmer.save();

  // Return farmer without password
  const farmerObj = farmer.toObject();
  delete (farmerObj as any).password;
  delete (farmerObj as any).refreshToken;
  delete (farmerObj as any).verifyCode;
  delete (farmerObj as any).verifyCodeExpire;
  delete (farmerObj as any).resetPasswordToken;
  delete (farmerObj as any).resetPasswordExpire;

  return farmerObj;
};

