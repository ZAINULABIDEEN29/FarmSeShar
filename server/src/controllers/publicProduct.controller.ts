import type { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware.js";
import {
  getPublicProductsService,
  getPublicProductByIdService,
} from "../services/publicProduct.service.js";
import { ApiError } from "../utils/ApiError.js";



export const getPublicProducts = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const filters = req.query as any;
    const products = await getPublicProductsService(filters);
    return res.status(200).json({
      success: true,
      products,
      count: products.length,
    });
  }
);



export const getPublicProductById = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const productId = req.params.id;
    if (!productId) {
      throw new ApiError(400, "Product ID is required");
    }
    const product = await getPublicProductByIdService(productId);
    return res.status(200).json({
      success: true,
      product,
    });
  }
);
