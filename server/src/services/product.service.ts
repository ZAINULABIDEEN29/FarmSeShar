import Product from "../models/product.model.js";
import { ApiError } from "../utils/ApiError.js";
import type { CreateProductInput, UpdateProductInput, ProductQueryInput } from "../validator/product.schema.js";
import type { IPRODUCT } from "../models/product.model.js";
import mongoose from "mongoose";



export const createProductService = async (
  farmerId: string,
  data: CreateProductInput
): Promise<IPRODUCT> => {
  if (!farmerId) {
    throw new ApiError(400, "Farmer ID is required");
  }
  const product = new Product({
    ...data,
    farmerId: new mongoose.Types.ObjectId(farmerId),
  });
  await product.save();
  return product;
};
export const getProductsService = async (
  farmerId: string,
  filters?: ProductQueryInput
): Promise<IPRODUCT[]> => {
  if (!farmerId) {
    throw new ApiError(400, "Farmer ID is required");
  }
  const query: any = {
    farmerId: new mongoose.Types.ObjectId(farmerId),
  };
  if (filters?.category) {
    query.category = filters.category;
  }
  if (filters?.isAvailable !== undefined) {
    query.isAvailable = filters.isAvailable;
  }
  if (filters?.minPrice !== undefined || filters?.maxPrice !== undefined) {
    query.price = {};
    if (filters.minPrice !== undefined) {
      query.price.$gte = filters.minPrice;
    }
    if (filters.maxPrice !== undefined) {
      query.price.$lte = filters.maxPrice;
    }
  }
  if (filters?.search) {
    query.$or = [
      { name: { $regex: filters.search, $options: "i" } },
      { description: { $regex: filters.search, $options: "i" } },
    ];
  }
  const products = await Product.find(query).sort({ createdAt: -1 });
  return products;
};
export const getProductByIdService = async (
  productId: string,
  farmerId: string
): Promise<IPRODUCT> => {
  if (!productId) {
    throw new ApiError(400, "Product ID is required");
  }
  if (!farmerId) {
    throw new ApiError(400, "Farmer ID is required");
  }
  const product = await Product.findOne({
    _id: new mongoose.Types.ObjectId(productId),
    farmerId: new mongoose.Types.ObjectId(farmerId),
  });
  if (!product) {
    throw new ApiError(404, "Product not found");
  }
  return product;
};
export const updateProductService = async (
  productId: string,
  farmerId: string,
  data: UpdateProductInput
): Promise<IPRODUCT> => {
  if (!productId) {
    throw new ApiError(400, "Product ID is required");
  }
  if (!farmerId) {
    throw new ApiError(400, "Farmer ID is required");
  }
  const product = await Product.findOne({
    _id: new mongoose.Types.ObjectId(productId),
    farmerId: new mongoose.Types.ObjectId(farmerId),
  });
  if (!product) {
    throw new ApiError(404, "Product not found");
  }
  Object.assign(product, data);
  await product.save();
  return product;
};
export const deleteProductService = async (
  productId: string,
  farmerId: string
): Promise<void> => {
  if (!productId) {
    throw new ApiError(400, "Product ID is required");
  }
  if (!farmerId) {
    throw new ApiError(400, "Farmer ID is required");
  }
  const product = await Product.findOneAndDelete({
    _id: new mongoose.Types.ObjectId(productId),
    farmerId: new mongoose.Types.ObjectId(farmerId),
  });
  if (!product) {
    throw new ApiError(404, "Product not found");
  }
};
export const toggleProductAvailabilityService = async (
  productId: string,
  farmerId: string
): Promise<IPRODUCT> => {
  if (!productId) {
    throw new ApiError(400, "Product ID is required");
  }
  if (!farmerId) {
    throw new ApiError(400, "Farmer ID is required");
  }
  const product = await Product.findOne({
    _id: new mongoose.Types.ObjectId(productId),
    farmerId: new mongoose.Types.ObjectId(farmerId),
  });
  if (!product) {
    throw new ApiError(404, "Product not found");
  }
  product.isAvailable = !product.isAvailable;
  await product.save();
  return product;
};
