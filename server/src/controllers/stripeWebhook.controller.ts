import type { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware.js";
import stripe, { handleStripeWebhook } from "../services/stripe.service.js";
import { ApiError } from "../utils/ApiError.js";
export const stripeWebhook = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const sig = req.headers["stripe-signature"];
    if (!sig) {
      throw new ApiError(400, "Missing Stripe signature");
    }
    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      throw new ApiError(500, "Stripe webhook secret not configured");
    }
    if (!stripe) {
      throw new ApiError(500, "Stripe is not configured");
    }
    let event;
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err: any) {
      console.error("Webhook signature verification failed:", err.message);
      throw new ApiError(400, `Webhook Error: ${err.message}`);
    }
    await handleStripeWebhook(event);
    res.json({ received: true });
  }
);
