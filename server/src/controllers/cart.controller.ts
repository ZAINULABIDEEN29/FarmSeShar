import type { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware.js";
import {
  getCartService,
  addToCartService,
  updateCartItemService,
  removeFromCartService,
  clearCartService,
} from "../services/cart.service.js";
import { ApiError } from "../utils/ApiError.js";
export const getCart = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const userId = req.user?._id?.toString();
    if (!userId) {
      throw new ApiError(401, "Unauthorized: User not authenticated");
    }
    const cart = await getCartService(userId);
    return res.status(200).json({
      success: true,
      cart,
    });
  }
);
export const addToCart = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const userId = req.user?._id?.toString();
    if (!userId) {
      throw new ApiError(401, "Unauthorized: User not authenticated");
    }
    const cart = await addToCartService(userId, req.body);
    return res.status(200).json({
      success: true,
      message: "Item added to cart successfully",
      cart,
    });
  }
);
export const updateCartItem = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const userId = req.user?._id?.toString();
    const productId = req.params.productId;
    if (!userId) {
      throw new ApiError(401, "Unauthorized: User not authenticated");
    }
    if (!productId) {
      throw new ApiError(400, "Product ID is required");
    }
    const cart = await updateCartItemService(userId, productId, req.body);
    return res.status(200).json({
      success: true,
      message: "Cart item updated successfully",
      cart,
    });
  }
);
export const removeFromCart = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const userId = req.user?._id?.toString();
    const productId = req.params.productId;
    if (!userId) {
      throw new ApiError(401, "Unauthorized: User not authenticated");
    }
    if (!productId) {
      throw new ApiError(400, "Product ID is required");
    }
    const cart = await removeFromCartService(userId, productId);
    return res.status(200).json({
      success: true,
      message: "Item removed from cart successfully",
      cart,
    });
  }
);
export const clearCart = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const userId = req.user?._id?.toString();
    if (!userId) {
      throw new ApiError(401, "Unauthorized: User not authenticated");
    }
    const cart = await clearCartService(userId);
    return res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
      cart,
    });
  }
);
