import express from "express";
const router = express.Router();
import {
  createReview,
  getProductReviews,
  getProductRatingStats,
  getUserReview,
  updateReview,
  deleteReview,
} from "../controllers/review.controller.js";
import { authUser } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  createReviewSchema,
  updateReviewSchema,
  reviewQuerySchema,
} from "../validator/review.schema.js";

// Public routes
router.get("/products/:productId/reviews", validate(reviewQuerySchema, "query"), getProductReviews);
router.get("/products/:productId/rating-stats", getProductRatingStats);

// Protected routes (require user authentication)
router.get("/products/:productId/my-review", authUser, getUserReview);
router.post("/reviews", authUser, validate(createReviewSchema), createReview);
router.put("/reviews/:id", authUser, validate(updateReviewSchema), updateReview);
router.delete("/reviews/:id", authUser, deleteReview);

export default router;

