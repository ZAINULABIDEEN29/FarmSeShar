import express from "express"
const router = express.Router();
import { registerFarmer,loginFarmer,logoutFarmer,getFarmer,verifyCodeForFarmer, forgotPasswordFarmer, resetPasswordFarmer } from "../controllers/authFarmer.controller.js";
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

// Authentication routes
router.post("/register-farmer",validate(registerFarmerSchema),registerFarmer)
router.post("/verify-farmer",validate(verifyCodeSchema),verifyCodeForFarmer);
router.post("/login-farmer",validate(loginFarmerSchema),loginFarmer)
router.post("/forgot-password",validate(forgotPasswordSchema),forgotPasswordFarmer)
router.post("/reset-password",validate(resetPasswordSchema),resetPasswordFarmer)
router.get("/farmer",authFarmer,getFarmer)
router.get("/logout",authFarmer,logoutFarmer)

// Product routes (protected - requires farmer authentication)
router.get("/products", authFarmer, getProducts);
router.get("/products/:id", authFarmer, getProductById);
router.post("/products", authFarmer, validate(createProductSchema), createProduct);
router.put("/products/:id", authFarmer, validate(updateProductSchema), updateProduct);
router.delete("/products/:id", authFarmer, deleteProduct);
router.patch("/products/:id/toggle-availability", authFarmer, toggleProductAvailability);

export default router;