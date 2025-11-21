import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import Review from "../models/review.model.js";
import Product from "../models/product.model.js";
import User from "../models/user.model.js";
import type { IREVIEW } from "../models/review.model.js";
import type { CreateReviewInput, UpdateReviewInput, ReviewQueryInput } from "../validator/review.schema.js";

export interface ReviewWithUser {
  _id: string;
  productId: string;
  userId: string;
  rating: number;
  comment?: string;
  createdAt: string;
  updatedAt?: string;
  user: {
    _id: string;
    fullName: {
      firstName: string;
      lastName: string;
    };
    email: string;
  };
}

export interface ProductRatingStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}


export const getProductRatingStatsService = async (
  productId: string
): Promise<ProductRatingStats> => {
  if (!productId) {
    throw new ApiError(400, "Product ID is required");
  }

  const reviews = await Review.find({
    productId: new mongoose.Types.ObjectId(productId),
  }).lean();

  const totalReviews = reviews.length;
  
  if (totalReviews === 0) {
    return {
      averageRating: 0,
      totalReviews: 0,
      ratingDistribution: {
        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1: 0,
      },
    };
  }

  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = totalRating / totalReviews;

  const ratingDistribution = {
    5: reviews.filter((r) => r.rating === 5).length,
    4: reviews.filter((r) => r.rating === 4).length,
    3: reviews.filter((r) => r.rating === 3).length,
    2: reviews.filter((r) => r.rating === 2).length,
    1: reviews.filter((r) => r.rating === 1).length,
  };

  return {
    averageRating: Math.round(averageRating * 10) / 10, 
    totalReviews,
    ratingDistribution,
  };
};


export const createReviewService = async (
  userId: string,
  data: CreateReviewInput
): Promise<IREVIEW> => {
  if (!userId) {
    throw new ApiError(400, "User ID is required");
  }

  
  const product = await Product.findById(data.productId);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }


  const existingReview = await Review.findOne({
    productId: new mongoose.Types.ObjectId(data.productId),
    userId: new mongoose.Types.ObjectId(userId),
  });

  if (existingReview) {
    throw new ApiError(400, "You have already reviewed this product. Please update your existing review.");
  }

  const review = new Review({
    productId: new mongoose.Types.ObjectId(data.productId),
    userId: new mongoose.Types.ObjectId(userId),
    rating: data.rating,
    comment: data.comment || undefined,
  });

  await review.save();
  return review;
};


export const getProductReviewsService = async (
  productId: string,
  filters?: ReviewQueryInput
): Promise<{ reviews: ReviewWithUser[]; total: number; page: number; pages: number }> => {
  if (!productId) {
    throw new ApiError(400, "Product ID is required");
  }

  const page = filters?.page || 1;
  const limit = filters?.limit || 10;
  const skip = (page - 1) * limit;

  const query: any = {
    productId: new mongoose.Types.ObjectId(productId),
  };

  if (filters?.rating) {
    query.rating = filters.rating;
  }

  const [reviews, total] = await Promise.all([
    Review.find(query)
      .populate("userId", "fullName email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Review.countDocuments(query),
  ]);

  const transformedReviews: ReviewWithUser[] = reviews.map((review: any) => {
    const user = review.userId && typeof review.userId === 'object'
      ? {
          _id: review.userId._id?.toString() || review.userId.toString(),
          fullName: review.userId.fullName || { firstName: "", lastName: "" },
          email: review.userId.email || "",
        }
      : {
          _id: "",
          fullName: { firstName: "Unknown", lastName: "User" },
          email: "",
        };

    return {
      _id: review._id.toString(),
      productId: review.productId.toString(),
      userId: review.userId.toString(),
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt ? new Date(review.createdAt).toISOString() : new Date().toISOString(),
      updatedAt: review.updatedAt ? new Date(review.updatedAt).toISOString() : undefined,
      user,
    };
  });

  return {
    reviews: transformedReviews,
    total,
    page,
    pages: Math.ceil(total / limit),
  };
};


export const getUserReviewService = async (
  userId: string,
  productId: string
): Promise<ReviewWithUser | null> => {
  if (!userId || !productId) {
    return null;
  }

  const review = await Review.findOne({
    productId: new mongoose.Types.ObjectId(productId),
    userId: new mongoose.Types.ObjectId(userId),
  })
    .populate("userId", "fullName email")
    .lean();

  if (!review) {
    return null;
  }

  const user = (review as any).userId && typeof (review as any).userId === 'object'
    ? {
        _id: (review as any).userId._id?.toString() || (review as any).userId.toString(),
        fullName: (review as any).userId.fullName || { firstName: "", lastName: "" },
        email: (review as any).userId.email || "",
      }
    : {
        _id: "",
        fullName: { firstName: "Unknown", lastName: "User" },
        email: "",
      };

  return {
    _id: review._id.toString(),
    productId: review.productId.toString(),
    userId: review.userId.toString(),
    rating: review.rating,
    comment: review.comment,
    createdAt: review.createdAt ? new Date(review.createdAt).toISOString() : new Date().toISOString(),
    updatedAt: review.updatedAt ? new Date(review.updatedAt).toISOString() : undefined,
    user,
  };
};


export const updateReviewService = async (
  userId: string,
  reviewId: string,
  data: UpdateReviewInput
): Promise<IREVIEW> => {
  if (!userId) {
    throw new ApiError(400, "User ID is required");
  }

  const review = await Review.findOne({
    _id: new mongoose.Types.ObjectId(reviewId),
    userId: new mongoose.Types.ObjectId(userId),
  });

  if (!review) {
    throw new ApiError(404, "Review not found");
  }

  if (data.rating !== undefined) {
    review.rating = data.rating;
  }
  if (data.comment !== undefined) {
    review.comment = data.comment || undefined;
  }

  await review.save();
  return review;
};


export const deleteReviewService = async (
  userId: string,
  reviewId: string
): Promise<void> => {
  if (!userId) {
    throw new ApiError(400, "User ID is required");
  }

  const review = await Review.findOne({
    _id: new mongoose.Types.ObjectId(reviewId),
    userId: new mongoose.Types.ObjectId(userId),
  });

  if (!review) {
    throw new ApiError(404, "Review not found");
  }

  await Review.deleteOne({ _id: review._id });
};

