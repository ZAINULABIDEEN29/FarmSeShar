import express from "express"
const router = express.Router();
import { registerFarmer,loginFarmer,logoutFarmer,getFarmer,verifyCodeForFarmer, forgotPasswordFarmer, resetPasswordFarmer } from "../controllers/authFarmer.controller.js";
import { authFarmer } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { forgotPasswordSchema, loginFarmerSchema, registerFarmerSchema, resetPasswordSchema, verifyCodeSchema } from "../validator/farmerAuth.schema.js";


router.post("/register-farmer",validate(registerFarmerSchema),registerFarmer)
router.post("/verify-farmer",validate(verifyCodeSchema),verifyCodeForFarmer);
router.post("/login-farmer",validate(loginFarmerSchema),loginFarmer)
router.post("/forgot-password",validate(forgotPasswordSchema),forgotPasswordFarmer)
router.post("/reset-password",validate(resetPasswordSchema),resetPasswordFarmer)
router.get("/farmer",authFarmer,getFarmer)
router.get("/logout",authFarmer,logoutFarmer)


export default router;