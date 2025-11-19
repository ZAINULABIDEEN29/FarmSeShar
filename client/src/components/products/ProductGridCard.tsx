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
    images?: string[];
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
    e.stopPropagation();
    onAddToCart?.(product._id);
  };
  const getProductLabel = () => {
    if (product.createdAt) {
      const createdDate = new Date(product.createdAt);
      const daysSinceCreation = (Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceCreation <= 7) {
        return "New";
      }
    }
    if (product.category === "Fruits" || product.category === "Vegetables") {
      return "Seasonal";
    }
    return "Local";
  };
  const productLabel = getProductLabel();
  return (
    <div 
      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col h-full cursor-pointer"
      onClick={handleCardClick}
    >
      {}
      <div className="relative w-full h-48 sm:h-56 bg-gray-100 flex items-center justify-center overflow-hidden">
        {(product.images && product.images.length > 0) || product.image ? (
          <img
            src={product.images?.[0] || product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
            <span>No image</span>
          </div>
        )}
        {}
        <div className="absolute top-2 left-2 z-10">
          <span className="bg-gray-900 text-white text-xs font-semibold px-2 py-1 rounded">
            {productLabel}
          </span>
        </div>
      </div>
      {}
      <div className="p-4 sm:p-5 flex-1 flex flex-col">
        {}
        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 line-clamp-2 min-h-10">
          {product.name}
        </h3>
        {}
        <div className="mb-2">
          <span className="text-lg sm:text-xl font-bold text-green-600">
            Rs.{product.price}
          </span>
          <span className="text-sm text-gray-600 ml-1">
            /{product.unit}
          </span>
        </div>
        {}
        {product.category && (
          <div className="mb-3">
            <span className="inline-block bg-gray-100 text-gray-700 text-xs font-medium px-2.5 py-1 rounded-full">
              {product.category}
            </span>
          </div>
        )}
        {}
        <div className="mb-3">
          {}
          <p className="text-sm font-medium text-gray-900 mb-1">
            {product.sellerName}
          </p>
          {}
          {product.location && (
            <p className="text-xs text-gray-500">
              {product.location}
            </p>
          )}
        </div>
        {}
        <div className="flex items-center gap-1 mb-4">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-medium text-gray-900">
            {product.rating.toFixed(1)}
          </span>
        </div>
        {}
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
