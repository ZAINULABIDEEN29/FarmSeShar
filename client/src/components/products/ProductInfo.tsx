import React from "react";
import { Star, User, MapPin, Plus, Minus, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
interface ProductInfoProps {
  product: {
    _id: string;
    name: string;
    price: number;
    originalPrice?: number;
    discountPercentage?: number;
    rating?: number;
    description: string;
    sellerName: string;
    farmerImage?: string;
    location?: string;
  };
  selectedWeight: string;
  onWeightChange: (weight: string) => void;
  quantity: number;
  onQuantityChange: (delta: number) => void;
  onQuantityInputChange: (value: number) => void;
  onAddToCart: () => void;
  onCheckout: () => void;
  isAddingToCart: boolean;
  weightOptions?: string[];
}
const ProductInfo: React.FC<ProductInfoProps> = ({
  product,
  selectedWeight,
  onWeightChange,
  quantity,
  onQuantityChange,
  onQuantityInputChange,
  onAddToCart,
  onCheckout,
  isAddingToCart,
  weightOptions = ["1 Kg", "2 Kg", "3 Kg", "4 Kg", "5 Kg"],
}) => {
  const rating = product.rating || 4.5;
  const fullRating = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  return (
    <div className="space-y-6">
      {}
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
        {product.name}
      </h1>
      {}
      <div className="flex items-center gap-2">
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={cn(
                "h-5 w-5",
                i < fullRating
                  ? "fill-yellow-400 text-yellow-400"
                  : i === fullRating && hasHalfStar
                  ? "fill-yellow-400/60 text-yellow-400"
                  : "text-gray-300"
              )}
            />
          ))}
        </div>
        <span className="text-base text-gray-600">
          {rating.toFixed(1)}/5
        </span>
      </div>
      {}
      <div className="flex items-baseline gap-3 flex-wrap">
        <span className="text-4xl sm:text-5xl font-bold text-gray-900">
          Rs.{product.price}
        </span>
        {product.originalPrice && product.originalPrice > product.price && (
          <>
            <span className="text-xl text-gray-500 line-through">
              Rs.{product.originalPrice}
            </span>
            {product.discountPercentage && (
              <span className="bg-green-500 text-white text-sm font-semibold px-2.5 py-1 rounded">
                -{product.discountPercentage}%
              </span>
            )}
          </>
        )}
      </div>
      {}
      <p className="text-base text-gray-700 leading-relaxed">
        {product.description}
      </p>
      {}
      <div className="border-t border-gray-200"></div>
      {}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden shrink-0">
          {product.farmerImage ? (
            <img
              src={product.farmerImage}
              alt={product.sellerName}
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="h-6 w-6 text-gray-500" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900">{product.sellerName}</p>
          {product.location && (
            <div className="flex items-center gap-1 mt-1">
              <MapPin className="h-4 w-4 text-gray-500 shrink-0" />
              <p className="text-sm text-gray-600 truncate">{product.location}</p>
            </div>
          )}
        </div>
      </div>
      {}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Choose weight
        </label>
        <div className="flex flex-wrap gap-2">
          {weightOptions.map((weight) => (
            <button
              key={weight}
              onClick={() => onWeightChange(weight)}
              className={cn(
                "px-4 py-2 rounded border-2 font-medium transition-all text-sm sm:text-base",
                selectedWeight === weight
                  ? "bg-green-600 text-white border-green-600"
                  : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
              )}
            >
              {weight}
            </button>
          ))}
        </div>
      </div>
      {}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 pt-4">
        {}
        <div className="flex items-center gap-4">
          <label className="text-sm font-semibold text-gray-700 whitespace-nowrap">Quantity:</label>
          <div className="flex items-center border border-gray-300 rounded-lg bg-gray-50">
            <button
              onClick={() => onQuantityChange(-1)}
              className="p-2 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-l-lg"
              disabled={quantity <= 1}
            >
              <Minus className="h-4 w-4 text-gray-600" />
            </button>
            <input
              type="number"
              value={quantity}
              onChange={(e) => onQuantityInputChange(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-16 text-center border-0 focus:outline-none focus:ring-0 bg-transparent text-gray-900 font-medium"
              min="1"
            />
            <button
              onClick={() => onQuantityChange(1)}
              className="p-2 hover:bg-gray-100 transition-colors rounded-r-lg"
            >
              <Plus className="h-4 w-4 text-gray-600" />
            </button>
          </div>
        </div>
        {}
        <div className="flex flex-row gap-3 w-full sm:w-auto">
          <Button
            onClick={onAddToCart}
            disabled={isAddingToCart}
            className="flex-1 sm:flex-initial bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 text-base whitespace-nowrap"
          >
            <ShoppingCart className="h-5 w-5 mr-2" />
            {isAddingToCart ? "Adding..." : "Add to Cart"}
          </Button>
          <Button
            onClick={onCheckout}
            disabled={isAddingToCart}
            className="flex-1 sm:flex-initial bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 text-base whitespace-nowrap"
          >
            Go to checkout
          </Button>
        </div>
      </div>
    </div>
  );
};
export default ProductInfo;
