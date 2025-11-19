import React, { useState, useMemo } from "react";
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
// Separate component for when we're inside Elements provider
const PaymentFormContentWithStripe: React.FC<{
  onSubmit: () => void;
  isLoading?: boolean;
  onCashPayment: () => void;
  paymentMethod: "card" | "cash";
  onPaymentMethodChange: (method: "card" | "cash") => void;
  showCardOption?: boolean;
  cardDisabled?: boolean;
  clientSecret?: string;
}> = ({ onSubmit, isLoading, onCashPayment, paymentMethod, onPaymentMethodChange, showCardOption = true, cardDisabled = false, clientSecret }) => {
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
      console.error("Stripe or Elements not available");
      return;
    }
    setIsProcessing(true);
    try {
      // First, submit the form to get the payment intent status
      const { error: submitError } = await elements.submit();
      if (submitError) {
        console.error("Form submission error:", submitError);
        throw new Error(submitError.message || "Please check your payment details");
      }

      // Confirm the payment
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/order-confirmation`,
        },
        redirect: "if_required",
      });

      if (error) {
        console.error("Stripe payment error:", error);
        // Handle specific error codes
        if (error.code === "payment_intent_unexpected_state") {
          // Payment intent might already be processing or completed
          // Try to retrieve it to check status if we have clientSecret
          if (clientSecret) {
            try {
              const retrieved = await stripe.retrievePaymentIntent(clientSecret);
              if (retrieved.paymentIntent?.status === "succeeded") {
                // Payment already succeeded, proceed
                onSubmit();
                return;
              } else if (retrieved.paymentIntent?.status === "processing") {
                throw new Error("Payment is being processed. Please wait a moment and try again.");
              } else {
                throw new Error(error.message || "Payment could not be processed. Please try again.");
              }
            } catch (retrieveError: any) {
              throw new Error(error.message || "Payment failed. Please try again.");
            }
          } else {
            throw new Error(error.message || "Payment failed. Please try again.");
          }
        } else {
          throw new Error(error.message || "Payment failed");
        }
      }

      // Check payment intent status
      if (paymentIntent) {
        if (paymentIntent.status === "succeeded") {
          // Payment succeeded, call the success handler
          onSubmit();
        } else if (paymentIntent.status === "processing") {
          // Payment is processing, wait a bit and check again
          throw new Error("Payment is being processed. Please wait a moment.");
        } else if (paymentIntent.status === "requires_action") {
          // Payment requires additional action (3D Secure, etc.)
          // Stripe will handle the redirect automatically
          return;
        } else {
          throw new Error(`Payment status: ${paymentIntent.status}. Please try again.`);
        }
      } else {
        throw new Error("Payment was not completed");
      }
    } catch (error: any) {
      console.error("Payment error:", error);
      // Re-throw to be handled by parent component
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
      {}
      <div className="space-y-3">
        {}
        {showCardOption && (
          <label
            className={cn(
              "flex items-center gap-3 p-4 border-2 rounded-lg transition-all",
              cardDisabled
                ? "opacity-60 cursor-not-allowed bg-gray-50"
                : "cursor-pointer",
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
              onChange={() => !cardDisabled && onPaymentMethodChange("card")}
              disabled={cardDisabled}
              className="w-4 h-4 text-green-500 border-gray-300 focus:ring-green-500 disabled:cursor-not-allowed"
            />
            <CreditCard className="h-5 w-5 text-gray-700" />
            <span className="flex-1 text-sm font-medium text-gray-900">
              Pay with Card
            </span>
            {cardDisabled && (
              <span className="text-xs text-gray-500">(Not available)</span>
            )}
          </label>
        )}
        {}
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
      {}
      {paymentMethod === "card" && (
        <div className="pt-4 border-t border-gray-200">
          {config.stripePublishableKey && stripe && elements ? (
            <PaymentElement />
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                Card payments are currently not available. Please use cash on delivery or contact support to enable card payments.
              </p>
            </div>
          )}
        </div>
      )}
      {}
      {paymentMethod === "cash" && (
        <div className="pt-4 border-t border-gray-200">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              You will pay cash when your order is delivered. Please have the exact amount ready.
            </p>
          </div>
        </div>
      )}
      {}
      <div className="pt-4">
        <Button
          type="submit"
          disabled={
            isLoading || 
            isProcessing || 
            (paymentMethod === "card" && (!stripe || cardDisabled))
          }
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

// Component for when we're NOT inside Elements provider (no Stripe hooks)
const PaymentFormContentWithoutStripe: React.FC<{
  onSubmit: () => void;
  isLoading?: boolean;
  onCashPayment: () => void;
  paymentMethod: "card" | "cash";
  onPaymentMethodChange: (method: "card" | "cash") => void;
  showCardOption?: boolean;
  cardDisabled?: boolean;
}> = ({ isLoading, onCashPayment, paymentMethod, onPaymentMethodChange, showCardOption = true, cardDisabled = false }) => {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentMethod === "cash") {
      onCashPayment();
      return;
    }
    // Card payment not available without Stripe
    return;
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
        Payment Method
      </h2>
      <div className="space-y-3">
        {showCardOption && (
          <label
            className={cn(
              "flex items-center gap-3 p-4 border-2 rounded-lg transition-all",
              cardDisabled
                ? "opacity-60 cursor-not-allowed bg-gray-50"
                : "cursor-pointer",
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
              onChange={() => !cardDisabled && onPaymentMethodChange("card")}
              disabled={cardDisabled}
              className="w-4 h-4 text-green-500 border-gray-300 focus:ring-green-500 disabled:cursor-not-allowed"
            />
            <CreditCard className="h-5 w-5 text-gray-700" />
            <span className="flex-1 text-sm font-medium text-gray-900">
              Pay with Card
            </span>
            {cardDisabled && (
              <span className="text-xs text-gray-500">(Not available)</span>
            )}
          </label>
        )}
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
      {paymentMethod === "card" && (
        <div className="pt-4 border-t border-gray-200">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              Card payments are currently not available. Please use cash on delivery or contact support to enable card payments.
            </p>
          </div>
        </div>
      )}
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
          type="submit"
          disabled={isLoading || (paymentMethod === "card" && cardDisabled)}
          className="w-full bg-green-500 text-white hover:bg-green-600 text-base sm:text-lg font-semibold py-6 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          size="lg"
        >
          {isLoading
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
  // Always show both payment options, but handle Stripe availability
  const hasStripeConfig = !!config.stripePublishableKey;
  const isValidStripeSecret = clientSecret && clientSecret !== "cash_payment" && stripePromise;
  
  // If Stripe is not configured, show both options but disable card (without Elements)
  if (!hasStripeConfig) {
    return (
      <PaymentFormContentWithoutStripe
        onSubmit={onSubmit}
        isLoading={isLoading}
        onCashPayment={onCashPayment}
        paymentMethod={paymentMethod}
        onPaymentMethodChange={onPaymentMethodChange}
        showCardOption={true}
        cardDisabled={true}
      />
    );
  }
  
  // If we have Stripe config but invalid clientSecret, still show both options (without Elements)
  if (!isValidStripeSecret) {
    return (
      <PaymentFormContentWithoutStripe
        onSubmit={onSubmit}
        isLoading={isLoading}
        onCashPayment={onCashPayment}
        paymentMethod={paymentMethod}
        onPaymentMethodChange={onPaymentMethodChange}
        showCardOption={true}
        cardDisabled={true}
      />
    );
  }
  
  // Create options only once when clientSecret is available
  // Use useMemo to prevent recreating options object
  const options: StripeElementsOptions = useMemo(() => ({
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
  }), [clientSecret]);
  
  // Wrap with Elements when we have valid Stripe setup
  // Use key prop to force remount when clientSecret changes
  return (
    <Elements key={clientSecret} options={options} stripe={stripePromise}>
      <PaymentFormContentWithStripe
        onSubmit={onSubmit}
        isLoading={isLoading}
        onCashPayment={onCashPayment}
        paymentMethod={paymentMethod}
        onPaymentMethodChange={onPaymentMethodChange}
        showCardOption={true}
        cardDisabled={false}
        clientSecret={clientSecret}
      />
    </Elements>
  );
};
export default StripePaymentForm;
