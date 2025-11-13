import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import Container from "@/components/container/Container";
import { CheckoutAddressForm, CartSummary } from "@/components/checkout";
import { useAppSelector } from "@/store/hooks";
import {
  selectCartItems,
  selectCartTotal,
  selectCartItemCount,
} from "@/store/slices/cartSlice";
import type { CheckoutAddress } from "@/types/checkout.types";
import { toast } from "react-toastify";
import { ShoppingBag } from "lucide-react";

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const cartItems = useAppSelector(selectCartItems);
  const cartTotals = useAppSelector(selectCartTotal);
  const cartItemCount = useAppSelector(selectCartItemCount);
  const discountPercentage = useAppSelector((state) => state.cart.discount);

  const handleLogoClick = () => {
    navigate("/");
  };

  const handleAccountClick = () => {
    navigate("/login");
  };

  const handleCartClick = () => {
    navigate("/cart");
  };

  const handleSubmitAddress = async (address: CheckoutAddress) => {
    setIsSubmitting(true);
    try {
      // TODO: Implement order submission API call
      console.log("Submitting order with address:", address);
      console.log("Cart items:", cartItems);
      console.log("Total:", cartTotals.total);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast.success("Order placed successfully!");
      // TODO: Navigate to order confirmation page
      // navigate("/order-confirmation");
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Redirect if cart is empty
  React.useEffect(() => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      navigate("/cart");
    }
  }, [cartItems.length, navigate]);

  return (
    <div className="w-full flex flex-col min-h-screen bg-white">
      <Header
        cartCount={cartItemCount}
        onAccountClick={handleAccountClick}
        onCartClick={handleCartClick}
        onLogoClick={handleLogoClick}
      />

      <main className="flex-1 py-8 sm:py-12 bg-white">
        <Container>
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Checkout
            </h1>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">
              Please provide your shipping address to continue
            </p>
          </div>

          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 sm:py-24">
              <ShoppingBag className="h-16 w-16 sm:h-24 sm:w-24 text-gray-400 mb-4" />
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
                Your cart is empty
              </h2>
              <p className="text-gray-600 mb-6 text-center px-4">
                Add items to your cart to proceed with checkout.
              </p>
              <button
                onClick={() => navigate("/")}
                className="px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors font-medium"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              {/* Checkout Form - Left Side */}
              <div className="lg:col-span-2">
                <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 lg:p-8">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
                    Shipping Address
                  </h2>
                  <CheckoutAddressForm
                    onSubmit={handleSubmitAddress}
                    isLoading={isSubmitting}
                  />
                </div>
              </div>

              {/* Cart Summary - Right Side */}
              <div className="lg:col-span-1">
                <div className="sticky top-24">
                  <CartSummary
                    items={cartItems}
                    subtotal={cartTotals.subtotal}
                    discount={cartTotals.discount}
                    discountPercentage={discountPercentage}
                    deliveryFee={cartTotals.deliveryFee}
                    total={cartTotals.total}
                  />
                </div>
              </div>
            </div>
          )}
        </Container>
      </main>

      <Footer />
    </div>
  );
};

export default CheckoutPage;

