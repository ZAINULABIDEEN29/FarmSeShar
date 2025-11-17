import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import type { StripeElementsOptions } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import config from "@/conf/conf";
import { Wallet, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";

// Initialize Stripe only if publishable key is provided
const stripePromise = config.stripePublishableKey 
  ? loadStripe(config.stripePublishableKey)
  : null;

interface StripePaymentFormProps {
  clientSecret: string;
  paymentMethod: "card" | "cash";
  onPaymentMethodChange: (method: "card" | "cash") => void;
  onSubmit: () => void;
  isLoading?: boolean;
  onCashPayment: () => void;
}

const PaymentFormContent: React.FC<{
  onSubmit: () => void;
  isLoading?: boolean;
  onCashPayment: () => void;
  paymentMethod: "card" | "cash";
  onPaymentMethodChange: (method: "card" | "cash") => void;
}> = ({ onSubmit, isLoading, onCashPayment, paymentMethod, onPaymentMethodChange }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (paymentMethod === "cash") {
      onCashPayment();
      return;
    }

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/order-confirmation`,
        },
        redirect: "if_required",
      });

      if (error) {
        throw new Error(error.message);
      }

      if (paymentIntent && paymentIntent.status === "succeeded") {
        onSubmit();
      }
    } catch (error: any) {
      console.error("Payment error:", error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
        Payment Method
      </h2>

      {/* Payment Method Selection */}
      <div className="space-y-3">
        {/* Card Payment Option */}
        <label
          className={cn(
            "flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all",
            paymentMethod === "card"
              ? "border-green-500 bg-green-50"
              : "border-gray-200 hover:border-gray-300 bg-white"
          )}
        >
          <input
            type="radio"
            name="paymentMethod"
            value="card"
            checked={paymentMethod === "card"}
            onChange={() => onPaymentMethodChange("card")}
            className="w-4 h-4 text-green-500 border-gray-300 focus:ring-green-500"
          />
          <CreditCard className="h-5 w-5 text-gray-700" />
          <span className="flex-1 text-sm font-medium text-gray-900">
            Pay with Card
          </span>
        </label>

        {/* Cash Payment Option */}
        <label
          className={cn(
            "flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all",
            paymentMethod === "cash"
              ? "border-green-500 bg-green-50"
              : "border-gray-200 hover:border-gray-300 bg-white"
          )}
        >
          <input
            type="radio"
            name="paymentMethod"
            value="cash"
            checked={paymentMethod === "cash"}
            onChange={() => onPaymentMethodChange("cash")}
            className="w-4 h-4 text-green-500 border-gray-300 focus:ring-green-500"
          />
          <Wallet className="h-5 w-5 text-gray-700" />
          <span className="flex-1 text-sm font-medium text-gray-900">
            Cash on Delivery
          </span>
        </label>
      </div>

      {/* Stripe Payment Element (only shown for card payments) */}
      {paymentMethod === "card" && config.stripePublishableKey && (
        <div className="pt-4 border-t border-gray-200">
          <PaymentElement />
        </div>
      )}

      {/* Cash Payment Info */}
      {paymentMethod === "cash" && (
        <div className="pt-4 border-t border-gray-200">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              You will pay cash when your order is delivered. Please have the exact amount ready.
            </p>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <div className="pt-4">
        <Button
          type="submit"
          disabled={isLoading || isProcessing || (paymentMethod === "card" && !stripe)}
          className="w-full bg-green-500 text-white hover:bg-green-600 text-base sm:text-lg font-semibold py-6 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          size="lg"
        >
          {isLoading || isProcessing
            ? "Processing..."
            : paymentMethod === "cash"
            ? "Place Order (Cash on Delivery)"
            : "Pay & Place Order"}
        </Button>
      </div>
    </form>
  );
};

const StripePaymentForm: React.FC<StripePaymentFormProps> = ({
  clientSecret,
  paymentMethod,
  onPaymentMethodChange,
  onSubmit,
  isLoading,
  onCashPayment,
}) => {
  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: "stripe",
      variables: {
        colorPrimary: "#16a34a", // Green color
        colorBackground: "#ffffff",
        colorText: "#1f2937",
        colorDanger: "#ef4444",
        fontFamily: "system-ui, sans-serif",
        spacingUnit: "4px",
        borderRadius: "8px",
      },
    },
  };

  // If Stripe is not configured, show simple form without Stripe Elements
  if (!config.stripePublishableKey) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
          Payment Method
        </h2>
        <div className="space-y-3">
          <label
            className={cn(
              "flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all",
              paymentMethod === "cash"
                ? "border-green-500 bg-green-50"
                : "border-gray-200 hover:border-gray-300 bg-white"
            )}
          >
            <input
              type="radio"
              name="paymentMethod"
              value="cash"
              checked={paymentMethod === "cash"}
              onChange={() => onPaymentMethodChange("cash")}
              className="w-4 h-4 text-green-500 border-gray-300 focus:ring-green-500"
            />
            <Wallet className="h-5 w-5 text-gray-700" />
            <span className="flex-1 text-sm font-medium text-gray-900">
              Cash on Delivery
            </span>
          </label>
        </div>
        {paymentMethod === "cash" && (
          <div className="pt-4 border-t border-gray-200">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                You will pay cash when your order is delivered. Please have the exact amount ready.
              </p>
            </div>
          </div>
        )}
        <div className="pt-4">
          <Button
            type="button"
            onClick={onCashPayment}
            disabled={isLoading || paymentMethod !== "cash"}
            className="w-full bg-green-500 text-white hover:bg-green-600 text-base sm:text-lg font-semibold py-6 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            size="lg"
          >
            {isLoading ? "Processing..." : "Place Order (Cash on Delivery)"}
          </Button>
        </div>
      </div>
    );
  }

  // Only render Stripe Elements if Stripe is configured
  if (!stripePromise) {
    return (
      <PaymentFormContent
        onSubmit={onSubmit}
        isLoading={isLoading}
        onCashPayment={onCashPayment}
        paymentMethod={paymentMethod}
        onPaymentMethodChange={onPaymentMethodChange}
      />
    );
  }

  return (
    <Elements options={options} stripe={stripePromise}>
      <PaymentFormContent
        onSubmit={onSubmit}
        isLoading={isLoading}
        onCashPayment={onCashPayment}
        paymentMethod={paymentMethod}
        onPaymentMethodChange={onPaymentMethodChange}
      />
    </Elements>
  );
};

export default StripePaymentForm;

