import express from "express";
const router = express.Router();
import {
  createPaymentIntent,
  confirmPayment,
} from "../controllers/payment.controller.js";
import { authUser } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { shippingAddressSchema } from "../validator/order.schema.js";
import { z } from "zod";
const createPaymentSchema = z.object({
  shippingAddress: shippingAddressSchema,
  paymentMethod: z.enum(["card", "cash"]),
});
router.post("/create-intent", authUser, validate(createPaymentSchema), createPaymentIntent);
router.post("/confirm", authUser, confirmPayment);
export default router;
