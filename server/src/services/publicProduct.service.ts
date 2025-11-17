import Product from "../models/product.model.js";
import Farmer from "../models/farmer.model.js";
import { ApiError } from "../utils/ApiError.js";
import type { ProductQueryInput } from "../validator/product.schema.js";
import type { IPRODUCT } from "../models/product.model.js";
import mongoose from "mongoose";

export interface PublicProduct {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  quantity: number;
  unit: string;
  image?: string;
  images?: string[];
  isAvailable: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  farmerId: string;
  farmer?: {
    _id: string;
    fullName: {
      firstName: string;
      lastName: string;
    };
    farmName: string;
    farmLocation: string;
  };
}

export const getPublicProductsService = async (
  filters?: ProductQueryInput
): Promise<PublicProduct[]> => {
  // Build query - only show available products with quantity > 0
  const query: any = {
    isAvailable: true,
    quantity: { $gt: 0 }, // Only show products with stock available
  };

  if (filters?.category) {
    query.category = filters.category;
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

  // Get products with farmer information
  // Only populate if farmerId exists and is a valid ObjectId
  const products = await Product.find(query)
    .populate({
      path: "farmerId",
      select: "fullName farmName farmLocation",
      match: { isVerified: true }, // Only show products from verified farmers
    })
    .sort({ createdAt: -1 })
    .lean();

  // Filter out products where farmer population failed (null farmerId after populate)
  // and transform products to include farmer info
  const transformedProducts: PublicProduct[] = products
    .filter((product: any) => {
      // Only include products with valid farmer information
      return product.farmerId && 
             (product.farmerId._id || product.farmerId.toString());
    })
    .map((product: any): PublicProduct => {
      const farmerId = product.farmerId?._id?.toString() || product.farmerId?.toString() || "";
      const farmer = product.farmerId && typeof product.farmerId === 'object'
        ? {
            _id: product.farmerId._id?.toString() || product.farmerId.toString(),
            fullName: product.farmerId.fullName || { firstName: "", lastName: "" },
            farmName: product.farmerId.farmName || "",
            farmLocation: product.farmerId.farmLocation || "",
          }
        : undefined;

      return {
        _id: product._id.toString(),
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        quantity: product.quantity,
        unit: product.unit,
        image: product.image,
        images: product.images || [],
        isAvailable: product.isAvailable,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
        farmerId,
        farmer,
      };
    });

  return transformedProducts;
};

export const getPublicProductByIdService = async (
  productId: string
): Promise<PublicProduct> => {
  if (!productId) {
    throw new ApiError(400, "Product ID is required");
  }

  const product = await Product.findOne({
    _id: new mongoose.Types.ObjectId(productId),
    isAvailable: true,
    quantity: { $gt: 0 }, // Only show products with stock available
  })
    .populate({
      path: "farmerId",
      select: "fullName farmName farmLocation",
      match: { isVerified: true }, // Only show products from verified farmers
    })
    .lean();

  if (!product) {
    throw new ApiError(404, "Product not found or not available");
  }

  // Check if farmer was populated (verified farmer exists)
  if (!product.farmerId || (typeof product.farmerId === 'object' && !product.farmerId._id)) {
    throw new ApiError(404, "Product not available");
  }

  // Transform product to include farmer info
  const farmerId = (product as any).farmerId?._id?.toString() || (product as any).farmerId?.toString() || "";
  const farmer = (product as any).farmerId && typeof (product as any).farmerId === 'object'
    ? {
        _id: (product as any).farmerId._id?.toString() || (product as any).farmerId.toString(),
        fullName: (product as any).farmerId.fullName || { firstName: "", lastName: "" },
        farmName: (product as any).farmerId.farmName || "",
        farmLocation: (product as any).farmerId.farmLocation || "",
      }
    : undefined;

  const transformedProduct: PublicProduct = {
    _id: product._id.toString(),
    name: product.name,
    description: product.description,
    price: product.price,
    category: product.category,
    quantity: product.quantity,
    unit: product.unit,
    image: product.image,
    images: product.images || [],
    isAvailable: product.isAvailable,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
    farmerId,
    farmer,
  };

  return transformedProduct;
};

