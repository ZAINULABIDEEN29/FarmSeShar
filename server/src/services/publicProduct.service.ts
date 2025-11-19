import Product from "../models/product.model.js";
import Farmer from "../models/farmer.model.js";
import { ApiError } from "../utils/ApiError.js";
import type { ProductQueryInput } from "../validator/product.schema.js";
import type { IPRODUCT } from "../models/product.model.js";
import { getProductRatingStatsService } from "./review.service.js";
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
  createdAt?: string;
  updatedAt?: string;
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
  sellerName?: string;
  location?: string;
  farmerImage?: string;
  rating?: number;
}
export const getPublicProductsService = async (
  filters?: ProductQueryInput
): Promise<PublicProduct[]> => {
  const query: any = {
    isAvailable: true,
    quantity: { $gt: 0 },
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
  const products = await Product.find(query)
    .populate({
      path: "farmerId",
      select: "fullName farmName farmLocation profileImage",
      match: { isVerified: true },
    })
    .sort({ createdAt: -1 })
    .lean();
  const filteredProducts = products.filter((product: any) => {
    return product.farmerId && 
           (product.farmerId._id || product.farmerId.toString());
  });

  // Fetch ratings for all products in parallel
  const productIds = filteredProducts.map((p: any) => p._id.toString());
  const ratingPromises = productIds.map(async (id: string) => {
    try {
      const stats = await getProductRatingStatsService(id);
      return { productId: id, rating: stats.totalReviews > 0 ? stats.averageRating : 4.5 };
    } catch (error) {
      return { productId: id, rating: 4.5 };
    }
  });
  const ratings = await Promise.all(ratingPromises);
  const ratingMap = new Map(ratings.map(r => [r.productId, r.rating]));

  const transformedProducts: PublicProduct[] = filteredProducts.map((product: any): PublicProduct => {
    const farmerId = product.farmerId?._id?.toString() || product.farmerId?.toString() || "";
    const farmer = product.farmerId && typeof product.farmerId === 'object'
      ? {
          _id: product.farmerId._id?.toString() || product.farmerId.toString(),
          fullName: product.farmerId.fullName || { firstName: "", lastName: "" },
          farmName: product.farmerId.farmName || "",
          farmLocation: product.farmerId.farmLocation || "",
          profileImage: product.farmerId.profileImage || undefined,
        }
      : undefined;
    
    // Generate seller name from farmer info
    const sellerName = farmer
      ? `${farmer.fullName.firstName} ${farmer.fullName.lastName}`.trim() || farmer.farmName || "Unknown Farmer"
      : "Unknown Farmer";
    
    // Get location from farmer
    const location = farmer?.farmLocation || "Unknown Location";
    
    // Use farmer's actual profile image if available, otherwise generate with DiceBear
    const farmerImage = farmer
      ? (farmer.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${farmer.fullName.firstName}${farmer.fullName.lastName}`)
      : undefined;
    
    // Get actual rating from reviews
    const rating = ratingMap.get(product._id.toString()) || 4.5;
    
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
      createdAt: product.createdAt ? new Date(product.createdAt).toISOString() : undefined as string | undefined,
      updatedAt: product.updatedAt ? new Date(product.updatedAt).toISOString() : undefined as string | undefined,
      farmerId,
      farmer,
      sellerName,
      location,
      farmerImage,
      rating,
    } as PublicProduct;
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
    quantity: { $gt: 0 },
  })
    .populate({
      path: "farmerId",
      select: "fullName farmName farmLocation profileImage",
      match: { isVerified: true },
    })
    .lean();
  if (!product) {
    throw new ApiError(404, "Product not found or not available");
  }
  if (!product.farmerId || (typeof product.farmerId === 'object' && !product.farmerId._id)) {
    throw new ApiError(404, "Product not available");
  }
  const farmerId = (product as any).farmerId?._id?.toString() || (product as any).farmerId?.toString() || "";
  const farmer = (product as any).farmerId && typeof (product as any).farmerId === 'object'
    ? {
        _id: (product as any).farmerId._id?.toString() || (product as any).farmerId.toString(),
        fullName: (product as any).farmerId.fullName || { firstName: "", lastName: "" },
        farmName: (product as any).farmerId.farmName || "",
        farmLocation: (product as any).farmerId.farmLocation || "",
        profileImage: (product as any).farmerId.profileImage || undefined,
      }
    : undefined;
  
  // Generate seller name from farmer info
  const sellerName = farmer
    ? `${farmer.fullName.firstName} ${farmer.fullName.lastName}`.trim() || farmer.farmName || "Unknown Farmer"
    : "Unknown Farmer";
  
  // Get location from farmer
  const location = farmer?.farmLocation || "Unknown Location";
  
  // Use farmer's actual profile image if available, otherwise generate with DiceBear
  const farmerImage = farmer
    ? (farmer.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${farmer.fullName.firstName}${farmer.fullName.lastName}`)
    : undefined;
  
  // Get actual rating from reviews
  let rating = 4.5; // Default fallback
  try {
    const ratingStats = await getProductRatingStatsService(productId);
    if (ratingStats.totalReviews > 0) {
      rating = ratingStats.averageRating;
    }
  } catch (error) {
    // If rating service fails, use default
    console.error("Error fetching rating:", error);
  }
  
  const transformedProduct: PublicProduct = {
    _id: product._id.toString(),
    name: product.name,
    description: product.description || "",
    price: product.price,
    category: product.category,
    quantity: product.quantity,
    unit: product.unit,
    image: product.image,
    images: product.images || [],
    isAvailable: product.isAvailable,
    createdAt: product.createdAt ? new Date(product.createdAt).toISOString() : undefined as string | undefined,
    updatedAt: product.updatedAt ? new Date(product.updatedAt).toISOString() : undefined as string | undefined,
    farmerId,
    farmer,
    sellerName,
    location,
    farmerImage,
    rating,
  };
  return transformedProduct;
};
