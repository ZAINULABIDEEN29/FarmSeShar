import mongoose, { Schema, Document } from "mongoose";

export interface IREVIEW extends Document {
  _id: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  rating: number;
  comment?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const reviewSchema: Schema<IREVIEW> = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product ID is required"],
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      index: true,
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating must be at most 5"],
    },
    comment: {
      type: String,
      trim: true,
      maxlength: [500, "Comment must be at most 500 characters"],
    },
  },
  { timestamps: true }
);

// Compound index to ensure one review per user per product
reviewSchema.index({ productId: 1, userId: 1 }, { unique: true });
reviewSchema.index({ productId: 1, rating: 1 });
reviewSchema.index({ createdAt: -1 });

const Review = mongoose.model<IREVIEW>("Review", reviewSchema);
export default Review;

