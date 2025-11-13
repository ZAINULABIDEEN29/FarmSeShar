import React from "react";
import { cn } from "@/lib/utils";
import type { CartItem as CartItemType } from "@/types/cart.types";

interface CartSummaryProps {
  items: CartItemType[];
  subtotal: number;
  discount: number;
  discountPercentage: number;
  deliveryFee: number;
  total: number;
  className?: string;
}

const CartSummary: React.FC<CartSummaryProps> = ({
  items,
  subtotal,
  discount,
  discountPercentage,
  deliveryFee,
  total,
  className,
}) => {
  return (
    <div
      className={cn(
        "bg-white border border-gray-200 rounded-lg p-4 sm:p-6 h-fit",
        className
      )}
    >
      <h2 className="text-xl font-bold text-gray-900 mb-6">
        Order Summary
      </h2>

      {/* Cart Items */}
      <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto">
        {items.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-4">
            No items in cart
          </p>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="flex gap-3 sm:gap-4 p-3 border border-gray-200 rounded-lg"
            >
              {/* Product Image */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 rounded-lg shrink-0 flex items-center justify-center overflow-hidden">
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
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                  {item.name}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                  {item.quantity} {item.unit}
                </p>
                <p className="text-sm sm:text-base font-semibold text-gray-900 mt-2">
                  Rs. {item.price * item.quantity}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Summary Details */}
      <div className="space-y-4 border-t border-gray-200 pt-4">
        <div className="flex justify-between items-center text-sm sm:text-base">
          <span className="text-gray-600">Subtotal:</span>
          <span className="font-medium text-gray-900">Rs. {subtotal}</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between items-center text-sm sm:text-base">
            <span className="text-gray-600">
              Discount ({-discountPercentage}%):
            </span>
            <span className="font-medium text-green-600">
              -Rs. {discount}
            </span>
          </div>
        )}

        <div className="flex justify-between items-center text-sm sm:text-base">
          <span className="text-gray-600">Delivery Fee:</span>
          <span className="font-medium text-gray-900">
            {deliveryFee === 0 ? (
              <span className="text-green-600">Free</span>
            ) : (
              `Rs. ${deliveryFee}`
            )}
          </span>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-gray-900">Total:</span>
            <span className="text-xl font-bold text-gray-900">Rs. {total}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;

