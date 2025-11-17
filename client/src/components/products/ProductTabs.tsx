import React, { useState } from "react";
import { Star, ChevronDown, MoreVertical, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "react-toastify";
import { useAppSelector } from "@/store/hooks";

export interface Review {
  id: string;
  reviewerName: string;
  rating: number;
  reviewText: string;
  postedDate: string;
  userId?: string; // User ID to identify review owner
}

interface ProductTabsProps {
  activeTab: "details" | "reviews";
  onTabChange: (tab: "details" | "reviews") => void;
  productDetails: {
    description: string;
    category: string;
  };
  reviews?: Review[];
  totalReviews?: number;
  isAuthenticated?: boolean;
  productId?: string;
  onReviewSubmit?: (review: { rating: number; reviewText: string }) => void;
  onReviewUpdate?: (reviewId: string, review: { rating: number; reviewText: string }) => void;
  onReviewDelete?: (reviewId: string) => void;
}

/**
 * Reusable product tabs component
 * Displays product details and reviews tabs
 */
// Mock reviews data - replace with actual data from props or API
const mockReviews: Review[] = [
  {
    id: "1",
    reviewerName: "Ali Hussain",
    rating: 5,
    reviewText: "Very fresh and sweet! The peas tasted just like they come straight from the farm. Perfect for my weekend pulao.",
    postedDate: "August 14, 2025",
  },
  {
    id: "2",
    reviewerName: "Fatima Ahmed",
    rating: 5,
    reviewText: "Excellent quality! The vegetables were crisp and fresh. Will definitely order again.",
    postedDate: "August 12, 2025",
  },
  {
    id: "3",
    reviewerName: "Hassan Khan",
    rating: 5,
    reviewText: "Amazing taste and texture. These are the best quality peas I've had in a long time. Highly recommended!",
    postedDate: "August 10, 2025",
  },
  {
    id: "4",
    reviewerName: "Ayesha Malik",
    rating: 5,
    reviewText: "Super fresh and sweet! Perfect for curries and salads. The packaging was also great.",
    postedDate: "August 8, 2025",
  },
  {
    id: "5",
    reviewerName: "Bilal Shah",
    rating: 5,
    reviewText: "Great quality produce. The peas were tender and had a natural sweetness. Very satisfied with my purchase.",
    postedDate: "August 5, 2025",
  },
  {
    id: "6",
    reviewerName: "Sana Ali",
    rating: 5,
    reviewText: "Fresh from the farm! The taste is incredible and they stay fresh for days. Will be a regular customer.",
    postedDate: "August 3, 2025",
  },
];

const ProductTabs: React.FC<ProductTabsProps> = ({
  activeTab,
  onTabChange,
  productDetails,
  reviews: initialReviews = mockReviews,
  totalReviews: initialTotalReviews = 450,
  isAuthenticated = false,
  productId, // Reserved for future API integration
  onReviewSubmit,
  onReviewUpdate,
  onReviewDelete,
}) => {
  const { user } = useAppSelector((state) => state.auth);
  
  // Reserved for future API integration
  void productId;
  const [sortBy, setSortBy] = useState<"latest" | "oldest" | "highest" | "lowest">("latest");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [totalReviews, setTotalReviews] = useState(initialTotalReviews);
  
  // Review form state
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showReviewMenu, setShowReviewMenu] = useState<string | null>(null);

  // Sort reviews based on selected option
  const sortedReviews = React.useMemo(() => {
    const sorted = [...reviews];
    switch (sortBy) {
      case "latest":
        return sorted; // Already in latest order (mock data)
      case "oldest":
        return sorted.reverse();
      case "highest":
        return sorted.sort((a, b) => b.rating - a.rating);
      case "lowest":
        return sorted.sort((a, b) => a.rating - b.rating);
      default:
        return sorted;
    }
  }, [reviews, sortBy]);

  const getSortLabel = () => {
    switch (sortBy) {
      case "latest":
        return "Latest";
      case "oldest":
        return "Oldest";
      case "highest":
        return "Highest Rating";
      case "lowest":
        return "Lowest Rating";
      default:
        return "Latest";
    }
  };

  // Get current user's name
  const getCurrentUserName = () => {
    if (user?.fullName?.firstName && user?.fullName?.lastName) {
      return `${user.fullName.firstName} ${user.fullName.lastName}`;
    }
    return user?.email?.split("@")[0] || "Anonymous";
  };

  // Get current user's ID
  const getCurrentUserId = () => {
    return user?._id || "";
  };

  // Check if review belongs to current user
  const isUserReview = (review: Review) => {
    if (!isAuthenticated || !user) return false;
    const currentUserId = getCurrentUserId();
    return review.userId === currentUserId || 
           review.reviewerName === getCurrentUserName();
  };

  const handleWriteReviewClick = () => {
    if (!isAuthenticated) {
      toast.error("Please login to write a review");
      return;
    }
    setEditingReviewId(null);
    setRating(0);
    setReviewText("");
    setShowReviewModal(true);
  };

  const handleEditReview = (review: Review) => {
    if (!isAuthenticated) {
      toast.error("Please login to edit a review");
      return;
    }
    setEditingReviewId(review.id);
    setRating(review.rating);
    setReviewText(review.reviewText);
    setShowReviewMenu(null);
    setShowReviewModal(true);
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!isAuthenticated) {
      toast.error("Please login to delete a review");
      return;
    }

    setIsSubmitting(true);
    try {
      // If onReviewDelete callback is provided, use it (for API integration)
      if (onReviewDelete) {
        await onReviewDelete(reviewId);
      }

      // Remove review from the list
      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
      setTotalReviews((prev) => Math.max(0, prev - 1));
      setShowDeleteConfirm(null);
      setShowReviewMenu(null);

      toast.success("Review deleted successfully");
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error("Failed to delete review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }
    
    if (!reviewText.trim()) {
      toast.error("Please write your review");
      return;
    }

    if (reviewText.trim().length < 10) {
      toast.error("Review must be at least 10 characters long");
      return;
    }

    setIsSubmitting(true);

    try {
      const currentUserId = getCurrentUserId();
      const currentUserName = getCurrentUserName();

      if (editingReviewId) {
        // Update existing review
        if (onReviewUpdate) {
          await onReviewUpdate(editingReviewId, { rating, reviewText: reviewText.trim() });
        }

        // Update review in the list
        setReviews((prev) =>
          prev.map((r) =>
            r.id === editingReviewId
              ? {
                  ...r,
                  rating,
                  reviewText: reviewText.trim(),
                  postedDate: new Date().toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }) + " (edited)",
                }
              : r
          )
        );

        toast.success("Review updated successfully!");
      } else {
        // Create new review
        if (onReviewSubmit) {
          await onReviewSubmit({ rating, reviewText: reviewText.trim() });
        }

        const newReview: Review = {
          id: Date.now().toString(),
          reviewerName: currentUserName,
          rating,
          reviewText: reviewText.trim(),
          postedDate: new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          userId: currentUserId,
        };

        // Add review to the list (prepend for latest first)
        setReviews((prev) => [newReview, ...prev]);
        setTotalReviews((prev) => prev + 1);

        toast.success("Thank you for your review!");
      }

      // Reset form
      setRating(0);
      setReviewText("");
      setEditingReviewId(null);
      setShowReviewModal(false);
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error(editingReviewId ? "Failed to update review. Please try again." : "Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    if (!isSubmitting) {
      setShowReviewModal(false);
      setRating(0);
      setReviewText("");
      setHoveredRating(0);
      setEditingReviewId(null);
    }
  };

  return (
    <div>
      {/* Tab Headers */}
      <div className="border-b border-gray-200 mb-4 sm:mb-6 ">
        <div className="flex gap-4 sm:gap-6 overflow-x-auto">
          <button
            onClick={() => onTabChange("details")}
            className={cn(
              "pb-3 sm:pb-4 px-1 font-semibold text-sm sm:text-base transition-colors border-b-2 whitespace-nowrap",
              activeTab === "details"
                ? "text-green-600 border-green-600"
                : "text-gray-600 border-transparent hover:text-gray-900"
            )}
          >
            Product Details
          </button>
          <button
            onClick={() => onTabChange("reviews")}
            className={cn(
              "pb-3 sm:pb-4 px-1 font-semibold text-sm sm:text-base transition-colors border-b-2 whitespace-nowrap",
              activeTab === "reviews"
                ? "text-green-600 border-green-600"
                : "text-gray-600 border-transparent hover:text-gray-900"
            )}
          >
            Rating & Reviews
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "details" && (
        <div className="space-y-4 sm:space-y-5 md:space-y-6 bg-[#F9F9FA] py-4 px-2">
          {/* Description Paragraph */}
          <p className="text-sm sm:text-base text-[#83798E] leading-relaxed font-bold">
            {productDetails.description}
          </p>
          
          {/* Product Details List with Bullet Points */}
          <ul className="space-y-2.5 sm:space-y-3 text-sm sm:text-base text-[#83798E] list-disc pl-4 sm:pl-6">
            <li>
              <span className="font-bold text-[#83798E]">Type:</span>{" "}
              <span className="font-regular text-[#83798E]">Fresh Seasonal {productDetails.category}</span>
            </li>
            <li>
              <span className="font-bold text-[#83798E]">Source:</span>{" "}
              <span className="font-regular text-[#83798E]">Locally grown at farm</span>
            </li>
            <li>
              <span className="font-bold text-[#83798E]">Taste & Texture:</span>{" "}
              <span className="font-regular text-[#83798E]">Sweet, tender, and crisp</span>
            </li>
            <li>
              <span className="font-bold text-[#83798E]">Best For:</span>{" "}
              <span className="font-regular text-[#83798E]">Curries, pulao, salads, soups, and freezing</span>
            </li>
            <li>
              <span className="font-bold text-[#83798E]">Shelf Life:</span>{" "}
              <span className="font-regular text-[#83798E]">Stays fresh for 3-5 days when refrigerated</span>
            </li>
          </ul>
        </div>
      )}

      {activeTab === "reviews" && (
        <div className="space-y-6">
          {/* Reviews Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* All Reviews Heading */}
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              All Reviews{" "}
              <span className="text-base sm:text-lg font-normal text-gray-500">
                ({totalReviews})
              </span>
            </h2>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Sort Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowSortDropdown(!showSortDropdown)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors text-sm sm:text-base"
                >
                  {getSortLabel()}
                  <ChevronDown className={cn(
                    "h-4 w-4 transition-transform",
                    showSortDropdown && "rotate-180"
                  )} />
                </button>
                
                {/* Dropdown Menu */}
                {showSortDropdown && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setShowSortDropdown(false)}
                    />
                    <div className="absolute right-0 sm:right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                      <button
                        onClick={() => {
                          setSortBy("latest");
                          setShowSortDropdown(false);
                        }}
                        className={cn(
                          "w-full text-left px-4 py-2 text-sm hover:bg-gray-100 first:rounded-t-lg",
                          sortBy === "latest" && "bg-gray-50 font-medium"
                        )}
                      >
                        Latest
                      </button>
                      <button
                        onClick={() => {
                          setSortBy("oldest");
                          setShowSortDropdown(false);
                        }}
                        className={cn(
                          "w-full text-left px-4 py-2 text-sm hover:bg-gray-100",
                          sortBy === "oldest" && "bg-gray-50 font-medium"
                        )}
                      >
                        Oldest
                      </button>
                      <button
                        onClick={() => {
                          setSortBy("highest");
                          setShowSortDropdown(false);
                        }}
                        className={cn(
                          "w-full text-left px-4 py-2 text-sm hover:bg-gray-100",
                          sortBy === "highest" && "bg-gray-50 font-medium"
                        )}
                      >
                        Highest Rating
                      </button>
                      <button
                        onClick={() => {
                          setSortBy("lowest");
                          setShowSortDropdown(false);
                        }}
                        className={cn(
                          "w-full text-left px-4 py-2 text-sm hover:bg-gray-100 last:rounded-b-lg",
                          sortBy === "lowest" && "bg-gray-50 font-medium"
                        )}
                      >
                        Lowest Rating
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* Write a Review Button */}
              <Button
                onClick={handleWriteReviewClick}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg text-sm sm:text-base whitespace-nowrap"
              >
                Write a Review
              </Button>
            </div>
          </div>

          {/* Reviews Grid */}
          {sortedReviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {sortedReviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow relative"
                >
                  {/* Ellipsis Menu Icon - Only show for user's own reviews */}
                  {isUserReview(review) && (
                    <div className="absolute top-4 right-4">
                      <button
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors relative"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowReviewMenu(showReviewMenu === review.id ? null : review.id);
                        }}
                        aria-label="Review options"
                      >
                        <MoreVertical className="h-5 w-5 text-gray-600" />
                      </button>

                      {/* Dropdown Menu */}
                      {showReviewMenu === review.id && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setShowReviewMenu(null)}
                          />
                          <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditReview(review);
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 first:rounded-t-lg transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowDeleteConfirm(review.id);
                                setShowReviewMenu(null);
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 last:rounded-b-lg transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  {/* Star Rating */}
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "h-4 w-4 sm:h-5 sm:w-5",
                          i < review.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        )}
                      />
                    ))}
                  </div>

                  {/* Reviewer Name */}
                  <h3 className="font-bold text-gray-900 text-base sm:text-lg mb-2">
                    {review.reviewerName}
                  </h3>

                  {/* Review Text */}
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3 pr-8">
                    {review.reviewText}
                  </p>

                  {/* Posted Date */}
                  <p className="text-xs sm:text-sm text-gray-500">
                    Posted on {review.postedDate}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-600 text-base sm:text-lg">
                No reviews yet. Be the first to review this product!
              </p>
            </div>
          )}
        </div>
      )}

      {/* Review Form Modal */}
      {showReviewModal && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={handleCloseModal}
          />
          
          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  {editingReviewId ? "Edit Review" : "Write a Review"}
                </h2>
                <button
                  onClick={handleCloseModal}
                  disabled={isSubmitting}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Close modal"
                >
                  <X className="h-5 w-5 text-gray-600" />
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleReviewSubmit} className="p-4 sm:p-6">
                {/* Star Rating Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
            Your Rating <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        disabled={isSubmitting}
                        className="focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-transform hover:scale-110"
                        aria-label={`Rate ${star} star${star !== 1 ? "s" : ""}`}
                      >
                        <Star
                          className={cn(
                            "h-8 w-8 sm:h-10 sm:w-10 transition-colors",
                            star <= (hoveredRating || rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          )}
                        />
                      </button>
                    ))}
                    {rating > 0 && (
                      <span className="ml-2 text-sm text-gray-600">
                        {rating} {rating === 1 ? "star" : "stars"}
                      </span>
                    )}
                  </div>
                </div>

                {/* Review Text */}
                <div className="mb-6">
                  <label
                    htmlFor="reviewText"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
            Your Review <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="reviewText"
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    disabled={isSubmitting}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                    placeholder="Share your experience with this product..."
                    maxLength={500}
                  />
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-xs text-gray-500">
                      Minimum 10 characters required
                    </p>
                    <p className="text-xs text-gray-500">
                      {reviewText.length}/500
                    </p>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
                  <Button
                    type="button"
                    onClick={handleCloseModal}
                    disabled={isSubmitting}
                    variant="outline"
                    className="w-full sm:w-auto"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting || rating === 0 || reviewText.trim().length < 10}
                    className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-semibold"
                  >
                    {isSubmitting 
                      ? (editingReviewId ? "Updating..." : "Submitting...") 
                      : (editingReviewId ? "Update Review" : "Submit Review")}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => !isSubmitting && setShowDeleteConfirm(null)}
          />
          
          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="bg-white rounded-lg shadow-xl w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">
                  Delete Review
                </h2>
              </div>

              {/* Modal Body */}
              <div className="p-4 sm:p-6">
                <p className="text-gray-700 mb-6">
                  Are you sure you want to delete this review? This action cannot be undone.
                </p>

                {/* Modal Footer */}
                <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
                  <Button
                    type="button"
                    onClick={() => setShowDeleteConfirm(null)}
                    disabled={isSubmitting}
                    variant="outline"
                    className="w-full sm:w-auto"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={() => handleDeleteReview(showDeleteConfirm)}
                    disabled={isSubmitting}
                    className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-semibold"
                  >
                    {isSubmitting ? "Deleting..." : "Delete Review"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductTabs;

