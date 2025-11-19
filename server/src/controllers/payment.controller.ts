import type { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware.js";
import {
  createPaymentIntentService,
  confirmPaymentService,
} from "../services/stripe.service.js";
import { ApiError } from "../utils/ApiError.js";
import { shippingAddressSchema } from "../validator/order.schema.js";
export const createPaymentIntent = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const userId = req.user?._id?.toString();
    if (!userId) {
      throw new ApiError(401, "Unauthorized: User not authenticated");
    }
    // Validation is already done by middleware, req.body is validated
    const { shippingAddress, paymentMethod } = req.body;
    if (!shippingAddress) {
      throw new ApiError(400, "Shipping address is required");
    }
    if (!paymentMethod) {
      throw new ApiError(400, "Payment method is required");
    }
    const result = await createPaymentIntentService(
      userId,
      shippingAddress,
      paymentMethod
    );
    return res.status(200).json({
      success: true,
      clientSecret: result.clientSecret,
      paymentIntentId: result.paymentIntentId,
    });
  }
);
export const confirmPayment = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const userId = req.user?._id?.toString();
    if (!userId) {
      throw new ApiError(401, "Unauthorized: User not authenticated");
    }
    const { paymentIntentId, shippingAddress } = req.body;
    if (!paymentIntentId) {
      throw new ApiError(400, "Payment intent ID is required");
    }
    if (!shippingAddress) {
      throw new ApiError(400, "Shipping address is required");
    }
    // Validate shipping address
    let validatedAddress;
    try {
      validatedAddress = shippingAddressSchema.parse(shippingAddress);
    } catch (error: any) {
      throw new ApiError(400, `Invalid shipping address: ${error.message || "Validation failed"}`);
    }
    const order = await confirmPaymentService(
      userId,
      paymentIntentId,
      validatedAddress
    );
    return res.status(200).json({
      success: true,
      message: "Payment confirmed and order created successfully",
      order,
    });
  }
);
