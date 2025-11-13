import React, { memo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit2, Trash2, Eye, EyeOff } from "lucide-react";
import type { Product } from "@/types/product.types";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  onEdit?: (product: Product) => void;
  onDelete?: (productId: string) => void;
  onToggleAvailability?: (productId: string) => void;
  isLoading?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = memo(({
  product,
  onEdit,
  onDelete,
  onToggleAvailability,
  isLoading = false,
}) => {
  return (
    <div className="bg-white p-4 rounded-lg border shadow-sm hover:shadow-lg transition-shadow">
      <div className="flex flex-col h-full">
        {/* Product Image */}
        <div className="w-full h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-gray-400 text-sm">No Image</span>
          )}
        </div>

        {/* Product Info */}
        <div className="flex-1 flex flex-col">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
              {product.name}
            </h3>
            <Badge
              variant={product.isAvailable ? "default" : "secondary"}
              className={cn(
                "ml-2 shrink-0",
                product.isAvailable
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
              )}
            >
              {product.isAvailable ? "Available" : "Unavailable"}
            </Badge>
          </div>

          <p className="text-sm text-gray-600 mb-3 line-clamp-2 flex-1">
            {product.description}
          </p>

          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-2xl font-bold text-green-600">
                ${product.price.toFixed(2)}
              </span>
              <span className="text-sm text-gray-500 ml-1">/{product.unit}</span>
            </div>
            <div className="text-sm text-gray-600">
              Qty: <span className="font-medium">{product.quantity}</span>
            </div>
          </div>

          <div className="mb-3">
            <Badge variant="outline" className="text-xs">
              {product.category}
            </Badge>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-auto">
            {onToggleAvailability && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onToggleAvailability(product._id)}
                disabled={isLoading}
                className="flex-1"
              >
                {product.isAvailable ? (
                  <>
                    <EyeOff className="h-4 w-4 mr-1" />
                    Hide
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 mr-1" />
                    Show
                  </>
                )}
              </Button>
            )}
            {onEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(product)}
                disabled={isLoading}
                className="flex-1"
              >
                <Edit2 className="h-4 w-4 mr-1" />
                Edit
              </Button>
            )}
            {onDelete && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(product._id)}
                disabled={isLoading}
                className="flex-1 text-red-600 hover:text-red-700 hover:border-red-300"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

ProductCard.displayName = "ProductCard";

export default ProductCard;

