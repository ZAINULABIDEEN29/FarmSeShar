import type { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware.js";
import {
  createProductService,
  getProductsService,
  getProductByIdService,
  updateProductService,
  deleteProductService,
  toggleProductAvailabilityService,
} from "../services/product.service.js";
import { ApiError } from "../utils/ApiError.js";
import { productQuerySchema } from "../validator/product.schema.js";
import { ZodError } from "zod";
export const createProduct = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const farmerId = req.farmer?._id?.toString();
    if (!farmerId) {
      throw new ApiError(401, "Unauthorized: Farmer not authenticated");
    }
    const product = await createProductService(farmerId, req.body);
    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  }
);
export const getProducts = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const farmerId = req.farmer?._id?.toString();
    if (!farmerId) {
      throw new ApiError(401, "Unauthorized: Farmer not authenticated");
    }
    let filters;
    try {
      filters = productQuerySchema.parse(req.query);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new ApiError(400, "Invalid query parameters", error.issues);
      }
      throw error;
    }
    const products = await getProductsService(farmerId, filters);
    return res.status(200).json({
      success: true,
      products,
      count: products.length,
    });
  }
);
export const getProductById = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const farmerId = req.farmer?._id?.toString();
    const productId = req.params.id;
    if (!farmerId) {
      throw new ApiError(401, "Unauthorized: Farmer not authenticated");
    }
    if (!productId) {
      throw new ApiError(400, "Product ID is required");
    }
    const product = await getProductByIdService(productId, farmerId);
    return res.status(200).json({
      success: true,
      product,
    });
  }
);
export const updateProduct = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const farmerId = req.farmer?._id?.toString();
    const productId = req.params.id;
    if (!farmerId) {
      throw new ApiError(401, "Unauthorized: Farmer not authenticated");
    }
    if (!productId) {
      throw new ApiError(400, "Product ID is required");
    }
    const product = await updateProductService(productId, farmerId, req.body);
    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  }
);
export const deleteProduct = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const farmerId = req.farmer?._id?.toString();
    const productId = req.params.id;
    if (!farmerId) {
      throw new ApiError(401, "Unauthorized: Farmer not authenticated");
    }
    if (!productId) {
      throw new ApiError(400, "Product ID is required");
    }
    await deleteProductService(productId, farmerId);
    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  }
);
export const toggleProductAvailability = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const farmerId = req.farmer?._id?.toString();
    const productId = req.params.id;
    if (!farmerId) {
      throw new ApiError(401, "Unauthorized: Farmer not authenticated");
    }
    if (!productId) {
      throw new ApiError(400, "Product ID is required");
    }
    const product = await toggleProductAvailabilityService(productId, farmerId);
    return res.status(200).json({
      success: true,
      message: `Product ${product.isAvailable ? "activated" : "deactivated"} successfully`,
      product,
    });
  }
);
