import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { reviewService } from "@/services/review.service";
import type {
  ReviewFilters,
  CreateReviewInput,
  UpdateReviewInput,
} from "@/types/review.types";
import { toast } from "react-toastify";

export const reviewKeys = {
  all: ["reviews"] as const,
  product: (productId: string) => [...reviewKeys.all, "product", productId] as const,
  productReviews: (productId: string, filters?: ReviewFilters) =>
    [...reviewKeys.product(productId), "list", filters] as const,
  productStats: (productId: string) => [...reviewKeys.product(productId), "stats"] as const,
  userReview: (productId: string) => [...reviewKeys.product(productId), "user"] as const,
};

export const useProductReviews = (productId: string, filters?: ReviewFilters) => {
  return useQuery({
    queryKey: reviewKeys.productReviews(productId, filters),
    queryFn: () => reviewService.getProductReviews(productId, filters),
    enabled: !!productId,
    staleTime: 1 * 60 * 1000,
  });
};

export const useProductRatingStats = (productId: string) => {
  return useQuery({
    queryKey: reviewKeys.productStats(productId),
    queryFn: () => reviewService.getProductRatingStats(productId),
    enabled: !!productId,
    staleTime: 2 * 60 * 1000,
  });
};

export const useUserReview = (productId: string) => {
  return useQuery({
    queryKey: reviewKeys.userReview(productId),
    queryFn: () => reviewService.getUserReview(productId),
    enabled: !!productId,
    staleTime: 1 * 60 * 1000,
  });
};

export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateReviewInput) => reviewService.createReview(data),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.product(variables.productId) });
      toast.success(response.message || "Review submitted successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to submit review");
    },
  });
};

export const useUpdateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reviewId, data }: { reviewId: string; data: UpdateReviewInput }) =>
      reviewService.updateReview(reviewId, data),
    onSuccess: (response, variables) => {
      // Invalidate all review queries - we don't know the productId from reviewId
      queryClient.invalidateQueries({ queryKey: reviewKeys.all });
      toast.success(response.message || "Review updated successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update review");
    },
  });
};

export const useDeleteReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reviewId: string) => reviewService.deleteReview(reviewId),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.all });
      toast.success(response.message || "Review deleted successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete review");
    },
  });
};

