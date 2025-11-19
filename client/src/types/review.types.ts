export interface Review {
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

export interface CreateReviewInput {
  productId: string;
  rating: number;
  comment?: string;
}

export interface UpdateReviewInput {
  rating?: number;
  comment?: string;
}

export interface ReviewFilters {
  productId?: string;
  rating?: number;
  page?: number;
  limit?: number;
}

