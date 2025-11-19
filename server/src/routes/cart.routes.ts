import express from "express";
const router = express.Router();
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from "../controllers/cart.controller.js";
import { authUser } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  addToCartSchema,
  updateCartItemSchema,
} from "../validator/cart.schema.js";
router.get("/", authUser, getCart);
router.post("/add", authUser, validate(addToCartSchema), addToCart);
router.put("/items/:productId", authUser, validate(updateCartItemSchema), updateCartItem);
router.delete("/items/:productId", authUser, removeFromCart);
router.delete("/clear", authUser, clearCart);
export default router;
