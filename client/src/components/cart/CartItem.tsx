import React from "react";
import { Minus, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CartItem as CartItemType } from "@/types/cart.types";
import { cn } from "@/lib/utils";

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
  className?: string;
}

const CartItem: React.FC<CartItemProps> = ({
  item,
  onUpdateQuantity,
  onRemove,
  className,
}) => {
  const handleDecrease = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.id, item.quantity - 1);
    }
  };

  const handleIncrease = () => {
    onUpdateQuantity(item.id, item.quantity + 1);
  };

  const handleRemove = () => {
    onRemove(item.id);
  };

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row gap-4 p-4 border border-gray-200 rounded-lg bg-white hover:shadow-sm transition-shadow",
        className
      )}
    >
      {/* Product Image */}
      <div className="w-full sm:w-24 h-24 sm:h-24 bg-gray-200 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400 text-xs">No Image</span>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="flex-1 flex flex-col gap-2 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-base sm:text-lg truncate">
              {item.name}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Quantity: {item.quantity} {item.unit}
            </p>
            <p className="text-base sm:text-lg font-semibold text-gray-900 mt-2">
              Rs. {item.price * item.quantity}
            </p>
          </div>

          {/* Remove Button */}
          <button
            onClick={handleRemove}
            className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-md transition-colors"
            aria-label="Remove item"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center gap-2 mt-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handleDecrease}
            disabled={item.quantity <= 1}
            className="h-8 w-8 rounded-md bg-green-500 text-white border-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Decrease quantity"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium text-gray-900 min-w-[2rem] text-center">
            {item.quantity}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={handleIncrease}
            className="h-8 w-8 rounded-md bg-green-500 text-white border-green-500 hover:bg-green-600"
            aria-label="Increase quantity"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;

