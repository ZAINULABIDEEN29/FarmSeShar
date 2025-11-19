import type { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware.js";
import { ApiError } from "../utils/ApiError.js";
import {
  createReviewService,
  getProductReviewsService,
  getUserReviewService,
  updateReviewService,
  deleteReviewService,
  getProductRatingStatsService,
} from "../services/review.service.js";
import {
  createReviewSchema,
  updateReviewSchema,
  reviewQuerySchema,
} from "../validator/review.schema.js";
import { ZodError } from "zod";

export const createReview = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const userId = req.user?._id?.toString();
    if (!userId) {
      throw new ApiError(401, "Unauthorized: User not authenticated");
    }

    let reviewData;
    try {
      reviewData = createReviewSchema.parse(req.body);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new ApiError(400, "Invalid review data", error.issues);
      }
      throw error;
    }

    const review = await createReviewService(userId, reviewData);
    return res.status(201).json({
      success: true,
      message: "Review created successfully",
      data: review,
    });
  }
);

export const getProductReviews = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const productId = req.params.productId;
    if (!productId) {
      throw new ApiError(400, "Product ID is required");
    }

    let filters;
    try {
      filters = reviewQuerySchema.parse({ ...req.query, productId });
    } catch (error) {
      if (error instanceof ZodError) {
        throw new ApiError(400, "Invalid query parameters", error.issues);
      }
      throw error;
    }

    const result = await getProductReviewsService(productId, filters);
    return res.status(200).json({
      success: true,
      message: "Reviews retrieved successfully",
      data: result.reviews,
      pagination: {
        page: result.page,
        limit: filters?.limit || 10,
        total: result.total,
        pages: result.pages,
      },
    });
  }
);

export const getProductRatingStats = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const productId = req.params.productId;
    if (!productId) {
      throw new ApiError(400, "Product ID is required");
    }

    const stats = await getProductRatingStatsService(productId);
    return res.status(200).json({
      success: true,
      message: "Rating statistics retrieved successfully",
      data: stats,
    });
  }
);

export const getUserReview = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const userId = req.user?._id?.toString();
    const productId = req.params.productId;

    if (!userId) {
      throw new ApiError(401, "Unauthorized: User not authenticated");
    }
    if (!productId) {
      throw new ApiError(400, "Product ID is required");
    }

    const review = await getUserReviewService(userId, productId);
    return res.status(200).json({
      success: true,
      message: "User review retrieved successfully",
      data: review,
    });
  }
);

export const updateReview = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const userId = req.user?._id?.toString();
    const reviewId = req.params.id;

    if (!userId) {
      throw new ApiError(401, "Unauthorized: User not authenticated");
    }

    let updateData;
    try {
      updateData = updateReviewSchema.parse(req.body);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new ApiError(400, "Invalid update data", error.issues);
      }
      throw error;
    }

    const review = await updateReviewService(userId, reviewId, updateData);
    return res.status(200).json({
      success: true,
      message: "Review updated successfully",
      data: review,
    });
  }
);

export const deleteReview = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const userId = req.user?._id?.toString();
    const reviewId = req.params.id;

    if (!userId) {
      throw new ApiError(401, "Unauthorized: User not authenticated");
    }

    await deleteReviewService(userId, reviewId);
    return res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  }
);

