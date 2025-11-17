import type { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware.js";
import {
  createPaymentIntentService,
  confirmPaymentService,
} from "../services/stripe.service.js";
import { ApiError } from "../utils/ApiError.js";
import { shippingAddressSchema } from "../validator/order.schema.js";
import { z } from "zod";

export const createPaymentSchema = z.object({
  shippingAddress: shippingAddressSchema,
  paymentMethod: z.enum(["card", "cash"]),
});

export const createPaymentIntent = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const userId = req.user?._id?.toString();

    if (!userId) {
      throw new ApiError(401, "Unauthorized: User not authenticated");
    }

    // Validate request body
    const validatedData = createPaymentSchema.parse(req.body);

    const result = await createPaymentIntentService(
      userId,
      validatedData.shippingAddress,
      validatedData.paymentMethod
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

    const validatedAddress = shippingAddressSchema.parse(shippingAddress);

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

