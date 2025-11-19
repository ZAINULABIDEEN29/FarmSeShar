import express from "express"
import { getUser, loginUser, logoutUser, registerUser, verifyOtp, forgotPassword, resetPassword, refreshToken } from "../controllers/authUser.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { forgotPasswordSchema, loginSchema, registerSchema, resetPasswordSchema, verifyCode } from "../validator/auth.schema.js";
import { authUser } from "../middlewares/auth.middleware.js";
import { createOrder } from "../controllers/order.controller.js";
import { createOrderSchema } from "../validator/order.schema.js";
const router = express.Router();
router.post("/create",validate(registerSchema),registerUser)
router.post("/verify",validate(verifyCode),verifyOtp);
router.post("/forgot-password",validate(forgotPasswordSchema),forgotPassword);
router.post("/reset-password",validate(resetPasswordSchema),resetPassword);
router.post("/login",validate(loginSchema),loginUser)
router.post("/refresh", refreshToken);
router.get("/me", authUser, getUser);
router.get("/logout", authUser, logoutUser);
router.post("/orders", authUser, validate(createOrderSchema), createOrder);
export default router;