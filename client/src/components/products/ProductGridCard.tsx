import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Star, User, MapPin } from "lucide-react";
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
  };
  onAddToCart?: (productId: string) => void;
}

const ProductGridCard: React.FC<ProductGridCardProps> = ({
  product,
  onAddToCart,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col h-full">
      {/* Image with Local tag */}
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
        {/* Local tag - top left (black background, white text) */}
        <div className="absolute top-2 left-2">
          <span className="bg-gray-900 text-white text-xs font-semibold px-2 py-1 rounded-md">
            Local
          </span>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Product Name - Large, bold, dark gray */}
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 line-clamp-2">
          {product.name}
        </h3>

        {/* Price - Green price, gray unit */}
        <div className="mb-3">
          <span className="text-xl sm:text-2xl font-bold text-green-600">
            Rs.{product.price}
          </span>
          <span className="text-sm sm:text-base text-gray-600 ml-1">
            /{product.unit}
          </span>
        </div>

        {/* Seller Information with Rating */}
        <div className="flex items-start justify-between gap-3 mb-4">
          {/* Left: Farmer Image, Name, Location */}
          <div className="flex items-start gap-2 flex-1 min-w-0">
            {/* Farmer Image/Avatar */}
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden shrink-0">
              {product.farmerImage ? (
                <img
                  src={product.farmerImage}
                  alt={product.sellerName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="h-5 w-5 sm:h-6 sm:w-6 text-gray-500" />
              )}
            </div>
            {/* Seller Name and Location */}
            <div className="flex-1 min-w-0">
              {/* Seller Name - Dark gray */}
              <p className="text-sm sm:text-base font-medium text-gray-900 mb-1 truncate">
                {product.sellerName}
              </p>
              {/* Location with pin icon - Lighter gray */}
              {product.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 shrink-0" />
                  <p className="text-xs sm:text-sm text-gray-500 truncate">
                    {product.location}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right: Rating with star icon */}
          <div className="flex items-center gap-1 shrink-0">
            <Star className="h-4 w-4 sm:h-5 sm:w-5 fill-yellow-400 text-yellow-400" />
            <span className="text-sm sm:text-base font-medium text-gray-900">
              {product.rating}
            </span>
          </div>
        </div>

        {/* Add to Cart Button - Green with plus icon */}
        <Button
          onClick={() => onAddToCart?.(product._id)}
          className={cn(
            "bg-green-600 hover:bg-green-700 text-white font-bold",
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
