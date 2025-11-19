import express from "express"
const router = express.Router();
import { registerFarmer, loginFarmer, logoutFarmer, getFarmer, verifyCodeForFarmer, forgotPasswordFarmer, resetPasswordFarmer, refreshTokenFarmer, resendVerificationCodeForFarmer } from "../controllers/authFarmer.controller.js";
import { authFarmer } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { forgotPasswordSchema, loginFarmerSchema, registerFarmerSchema, resetPasswordSchema, verifyCodeSchema } from "../validator/farmerAuth.schema.js";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  toggleProductAvailability,
} from "../controllers/product.controller.js";
import {
  createProductSchema,
  updateProductSchema,
  productQuerySchema,
} from "../validator/product.schema.js";
import {
  getDashboardStats,
  getDashboardCustomers,
  getDashboardOrders,
  getDashboardShipments,
} from "../controllers/dashboard.controller.js";
import {
  updateOrderStatus,
  createShipment,
  updateShipmentStatus,
} from "../controllers/order.controller.js";
import {
  updateOrderStatusSchema,
  createShipmentSchema,
  updateShipmentStatusSchema,
} from "../validator/order.schema.js";
import { updateFarmerProfile } from "../controllers/farmerProfile.controller.js";
import { updateFarmerProfileSchema } from "../validator/farmer.schema.js";







router.post("/register-farmer", validate(registerFarmerSchema), registerFarmer);
router.post("/verify-farmer", validate(verifyCodeSchema), verifyCodeForFarmer);
router.post("/resend-verification", validate(forgotPasswordSchema), resendVerificationCodeForFarmer);
router.post("/login-farmer", validate(loginFarmerSchema), loginFarmer);
router.post("/refresh", refreshTokenFarmer);
router.post("/forgot-password", validate(forgotPasswordSchema), forgotPasswordFarmer);
router.post("/reset-password", validate(resetPasswordSchema), resetPasswordFarmer);
router.get("/farmer", authFarmer, getFarmer);
router.get("/logout", authFarmer, logoutFarmer);
router.put("/profile", authFarmer, validate(updateFarmerProfileSchema), updateFarmerProfile);
router.get("/products", authFarmer, getProducts);
router.get("/products/:id", authFarmer, getProductById);
router.post("/products", authFarmer, validate(createProductSchema), createProduct);
router.put("/products/:id", authFarmer, validate(updateProductSchema), updateProduct);
router.delete("/products/:id", authFarmer, deleteProduct);
router.patch("/products/:id/toggle-availability", authFarmer, toggleProductAvailability);
router.get("/dashboard/stats", authFarmer, getDashboardStats);
router.get("/dashboard/customers", authFarmer, getDashboardCustomers);
router.get("/dashboard/orders", authFarmer, getDashboardOrders);
router.get("/dashboard/shipments", authFarmer, getDashboardShipments);
router.patch("/orders/:id/status", authFarmer, validate(updateOrderStatusSchema), updateOrderStatus);
router.post("/shipments", authFarmer, validate(createShipmentSchema), createShipment);
router.patch("/shipments/:id/status", authFarmer, validate(updateShipmentStatusSchema), updateShipmentStatus);




export default router;