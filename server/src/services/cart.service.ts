import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";
import type { ICART, ICartItem } from "../models/cart.model.js";
import type { AddToCartInput, UpdateCartItemInput, RemoveFromCartInput } from "../validator/cart.schema.js";

export const getCartService = async (userId: string): Promise<ICART> => {
  if (!userId) {
    throw new ApiError(400, "User ID is required");
  }

  let cart = await Cart.findOne({ userId: new mongoose.Types.ObjectId(userId) });

  // Create cart if it doesn't exist
  if (!cart) {
    cart = new Cart({
      userId: new mongoose.Types.ObjectId(userId),
      items: [],
    });
    await cart.save();
  }

  return cart;
};

export const addToCartService = async (
  userId: string,
  data: AddToCartInput
): Promise<ICART> => {
  if (!userId) {
    throw new ApiError(400, "User ID is required");
  }

  // Verify product exists and is available
  const product = await Product.findById(data.productId);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  if (!product.isAvailable) {
    throw new ApiError(400, "Product is not available");
  }

  if (product.quantity < data.quantity) {
    throw new ApiError(400, `Insufficient stock. Only ${product.quantity} available`);
  }

  // Get or create cart
  let cart = await Cart.findOne({ userId: new mongoose.Types.ObjectId(userId) });

  if (!cart) {
    cart = new Cart({
      userId: new mongoose.Types.ObjectId(userId),
      items: [],
    });
  }

  // Check if product already in cart
  const existingItemIndex = cart.items.findIndex(
    (item) => item.productId.toString() === data.productId
  );

  if (existingItemIndex >= 0) {
    // Update quantity
    const newQuantity = cart.items[existingItemIndex].quantity + data.quantity;
    
    // Check stock availability
    if (product.quantity < newQuantity) {
      throw new ApiError(400, `Insufficient stock. Only ${product.quantity} available`);
    }

    cart.items[existingItemIndex].quantity = newQuantity;
    // Update price in case it changed
    cart.items[existingItemIndex].price = product.price;
  } else {
    // Add new item
    const cartItem: ICartItem = {
      productId: new mongoose.Types.ObjectId(data.productId),
      name: product.name,
      price: product.price,
      quantity: data.quantity,
      unit: product.unit,
      image: product.image || undefined,
    };
    cart.items.push(cartItem);
  }

  await cart.save();
  return cart;
};

export const updateCartItemService = async (
  userId: string,
  productId: string,
  data: UpdateCartItemInput
): Promise<ICART> => {
  if (!userId) {
    throw new ApiError(400, "User ID is required");
  }

  const cart = await Cart.findOne({ userId: new mongoose.Types.ObjectId(userId) });

  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  const itemIndex = cart.items.findIndex(
    (item) => item.productId.toString() === productId
  );

  if (itemIndex === -1) {
    throw new ApiError(404, "Item not found in cart");
  }

  // Verify product availability
  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  if (!product.isAvailable) {
    throw new ApiError(400, "Product is not available");
  }

  if (product.quantity < data.quantity) {
    throw new ApiError(400, `Insufficient stock. Only ${product.quantity} available`);
  }

  cart.items[itemIndex].quantity = data.quantity;
  cart.items[itemIndex].price = product.price; // Update price in case it changed

  await cart.save();
  return cart;
};

export const removeFromCartService = async (
  userId: string,
  productId: string
): Promise<ICART> => {
  if (!userId) {
    throw new ApiError(400, "User ID is required");
  }

  const cart = await Cart.findOne({ userId: new mongoose.Types.ObjectId(userId) });

  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  cart.items = cart.items.filter(
    (item) => item.productId.toString() !== productId
  );

  await cart.save();
  return cart;
};

export const clearCartService = async (userId: string): Promise<ICART> => {
  if (!userId) {
    throw new ApiError(400, "User ID is required");
  }

  const cart = await Cart.findOne({ userId: new mongoose.Types.ObjectId(userId) });

  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  cart.items = [];
  await cart.save();
  return cart;
};

