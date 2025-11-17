import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductGridCardProps {
  product: {
    _id: string;
    name: string;
    price: number;
    unit: string;
    image?: string;
    sellerName: string;
    farmerImage?: string;
    location?: string;
    rating: number;
    category?: string;
    createdAt?: string;
    isAvailable?: boolean;
  };
  onAddToCart?: (productId: string) => void;
}

const ProductGridCard: React.FC<ProductGridCardProps> = ({
  product,
  onAddToCart,
}) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/product/${product._id}`);
  };

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation when clicking add to cart
    onAddToCart?.(product._id);
  };

  // Determine label based on product properties
  const getProductLabel = () => {
    // Check if product is new (created within last 7 days)
    if (product.createdAt) {
      const createdDate = new Date(product.createdAt);
      const daysSinceCreation = (Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceCreation <= 7) {
        return "New";
      }
    }
    
    // Check category for seasonal items
    if (product.category === "Fruits" || product.category === "Vegetables") {
      return "Seasonal";
    }
    
    // Default to Local
    return "Local";
  };

  const productLabel = getProductLabel();

  return (
    <div 
      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col h-full cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Image with Label badge */}
      <div className="relative w-full h-48 sm:h-56 bg-gray-100 flex items-center justify-center overflow-hidden">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-gray-400 text-sm">No Image</span>
        )}
        {/* Label badge - top left (black background, white text) */}
        <div className="absolute top-2 left-2 z-10">
          <span className="bg-gray-900 text-white text-xs font-semibold px-2 py-1 rounded">
            {productLabel}
          </span>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col">
        {/* Product Name - Large, bold, dark gray */}
        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 line-clamp-2 min-h-10">
          {product.name}
        </h3>

        {/* Price - Green price with unit */}
        <div className="mb-2">
          <span className="text-lg sm:text-xl font-bold text-green-600">
            Rs.{product.price}
          </span>
          <span className="text-sm text-gray-600 ml-1">
            /{product.unit}
          </span>
        </div>

        {/* Category Tag - Small pill-shaped */}
        {product.category && (
          <div className="mb-3">
            <span className="inline-block bg-gray-100 text-gray-700 text-xs font-medium px-2.5 py-1 rounded-full">
              {product.category}
            </span>
          </div>
        )}

        {/* Seller Information */}
        <div className="mb-3">
          {/* Seller Name - Dark gray */}
          <p className="text-sm font-medium text-gray-900 mb-1">
            {product.sellerName}
          </p>
          {/* Location - Lighter gray */}
          {product.location && (
            <p className="text-xs text-gray-500">
              {product.location}
            </p>
          )}
        </div>

        {/* Rating with star icon */}
        <div className="flex items-center gap-1 mb-4">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-medium text-gray-900">
            {product.rating.toFixed(1)}
          </span>
        </div>

        {/* Add to Cart Button - Green with plus icon */}
        <Button
          onClick={handleAddToCartClick}
          className={cn(
            "bg-green-600 hover:bg-green-700 text-white font-semibold",
            "w-full py-2.5 sm:py-3 text-sm sm:text-base",
            "rounded-lg transition-colors duration-200",
            "flex items-center justify-center gap-2",
            "mt-auto"
          )}
        >
          <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
          Add to Cart
        </Button>
      </div>
    </div>
  );
};

export default ProductGridCard;
