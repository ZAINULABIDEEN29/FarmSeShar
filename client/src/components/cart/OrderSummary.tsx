import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface OrderSummaryProps {
  subtotal: number;
  discount: number;
  discountPercentage: number;
  deliveryFee: number;
  total: number;
  onApplyPromoCode?: (code: string) => void;
  onCheckout?: () => void;
  className?: string;
  promoCode?: string;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  subtotal,
  discount,
  discountPercentage,
  deliveryFee,
  total,
  onApplyPromoCode,
  onCheckout,
  className,
  promoCode,
}) => {
  const [promoInput, setPromoInput] = useState(promoCode || "");

  const handleApplyPromo = () => {
    if (promoInput.trim() && onApplyPromoCode) {
      onApplyPromoCode(promoInput.trim());
    }
  };

  return (
    <div
      className={cn(
        "bg-white border border-gray-200 rounded-lg p-6 h-fit sticky top-24",
        className
      )}
    >
      <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

      {/* Summary Details */}
      <div className="space-y-4 mb-6">
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

      {/* Promo Code Input */}
      <div className="mb-6">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Add promo code"
            value={promoInput}
            onChange={(e) => setPromoInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleApplyPromo();
              }
            }}
            className="flex-1"
          />
          <Button
            onClick={handleApplyPromo}
            disabled={!promoInput.trim()}
            className="bg-gray-800 text-white hover:bg-gray-900 whitespace-nowrap px-4 sm:px-6"
          >
            Apply
          </Button>
        </div>
      </div>

      {/* Checkout Button */}
      <Button
        onClick={onCheckout}
        className="w-full bg-green-500 text-white hover:bg-green-600 text-base sm:text-lg font-semibold py-6 rounded-md"
        size="lg"
      >
        Go to Checkout
      </Button>
    </div>
  );
};

export default OrderSummary;

