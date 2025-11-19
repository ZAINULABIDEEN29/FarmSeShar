import { z } from "zod";

export const createReviewSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  rating: z.number().int("Rating must be a whole number").min(1, "Rating must be at least 1").max(5, "Rating must be at most 5"),
  comment: z.string().max(500, "Comment must be at most 500 characters").optional(),
});

export const updateReviewSchema = z.object({
  rating: z.number().int("Rating must be a whole number").min(1, "Rating must be at least 1").max(5, "Rating must be at most 5").optional(),
  comment: z.string().max(500, "Comment must be at most 500 characters").optional(),
});

export const reviewQuerySchema = z.object({
  productId: z.string().min(1, "Product ID is required").optional(),
  userId: z.string().min(1, "User ID is required").optional(),
  rating: z.coerce.number().int().min(1).max(5).optional(),
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type UpdateReviewInput = z.infer<typeof updateReviewSchema>;
export type ReviewQueryInput = z.infer<typeof reviewQuerySchema>;

