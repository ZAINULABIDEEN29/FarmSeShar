import api from "./api";
import type {
  Review,
  ProductRatingStats,
  CreateReviewInput,
  UpdateReviewInput,
  ReviewFilters,
} from "@/types/review.types";

export const reviewService = {
  getProductReviews: async (
    productId: string,
    filters?: ReviewFilters
  ): Promise<{ reviews: Review[]; pagination: any }> => {
    const params = new URLSearchParams();
    if (filters?.rating) params.append("rating", filters.rating.toString());
    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.limit) params.append("limit", filters.limit.toString());
    const queryString = params.toString();
    const url = `/products/${productId}/reviews${queryString ? `?${queryString}` : ""}`;
    const response = await api.get<{
      success: boolean;
      data: Review[];
      pagination: any;
    }>(url);
    return {
      reviews: response.data.data,
      pagination: response.data.pagination,
    };
  },

  getProductRatingStats: async (productId: string): Promise<ProductRatingStats> => {
    const response = await api.get<{
      success: boolean;
      data: ProductRatingStats;
    }>(`/products/${productId}/rating-stats`);
    return response.data.data;
  },

  getUserReview: async (productId: string): Promise<Review | null> => {
    const response = await api.get<{
      success: boolean;
      data: Review | null;
    }>(`/products/${productId}/my-review`);
    return response.data.data;
  },

  createReview: async (data: CreateReviewInput): Promise<{ success: boolean; message: string; data: Review }> => {
    const response = await api.post<{
      success: boolean;
      message: string;
      data: Review;
    }>("/reviews", data);
    return response.data;
  },

  updateReview: async (
    reviewId: string,
    data: UpdateReviewInput
  ): Promise<{ success: boolean; message: string; data: Review }> => {
    const response = await api.put<{
      success: boolean;
      message: string;
      data: Review;
    }>(`/reviews/${reviewId}`, data);
    return response.data;
  },

  deleteReview: async (reviewId: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete<{
      success: boolean;
      message: string;
    }>(`/reviews/${reviewId}`);
    return response.data;
  },
};

