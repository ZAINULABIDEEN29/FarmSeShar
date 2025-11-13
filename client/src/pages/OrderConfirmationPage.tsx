import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import Container from "@/components/container/Container";
import { CheckCircle, MapPin, CreditCard, Wallet } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { selectCartItemCount } from "@/store/slices/cartSlice";
import type { CheckoutAddress } from "@/types/checkout.types";
import type { PaymentData } from "@/types/payment.types";
import { Button } from "@/components/ui/button";

interface LocationState {
  address?: CheckoutAddress;
  payment?: PaymentData;
  orderTotal?: number;
}

const OrderConfirmationPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const cartItemCount = useAppSelector(selectCartItemCount);
  const { address, payment, orderTotal } = (location.state as LocationState) || {};

  const handleLogoClick = () => {
    navigate("/");
  };

  const handleAccountClick = () => {
    navigate("/login");
  };

  const handleCartClick = () => {
    navigate("/cart");
  };

  const handleContinueShopping = () => {
    navigate("/");
  };

  // Redirect if no order data
  React.useEffect(() => {
    if (!address || !payment || !orderTotal) {
      navigate("/");
    }
  }, [address, payment, orderTotal, navigate]);

  if (!address || !payment || !orderTotal) {
    return null;
  }

  return (
    <div className="w-full flex flex-col min-h-screen bg-gray-50">
      <Header
        cartCount={cartItemCount}
        onAccountClick={handleAccountClick}
        onCartClick={handleCartClick}
        onLogoClick={handleLogoClick}
      />

      <main className="flex-1 py-8 sm:py-12 bg-gray-50">
        <Container>
          <div className="max-w-3xl mx-auto">
            {/* Success Icon and Message */}
            <div className="text-center mb-8 sm:mb-12">
              <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-green-100 rounded-full mb-6">
                <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 text-green-500" />
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Order Confirmed!
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 mb-2">
                Thank you for your order
              </p>
              <p className="text-base sm:text-lg text-green-600 font-semibold">
                You will receive your order in 7 days
              </p>
            </div>

            {/* Order Details Card */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 sm:p-8 mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
                Order Details
              </h2>

              <div className="space-y-6">
                {/* Shipping Address */}
                <div className="border-b border-gray-200 pb-6">
                  <div className="flex items-start gap-3 mb-4">
                    <MapPin className="h-5 w-5 text-gray-600 mt-0.5 shrink-0" />
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-gray-900 mb-2">
                        Shipping Address
                      </h3>
                      <div className="text-sm sm:text-base text-gray-600 space-y-1">
                        <p>{address.streetAddress}, {address.houseNo}</p>
                        <p>{address.town}, {address.city}</p>
                        <p>{address.country} - {address.postalCode}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="border-b border-gray-200 pb-6">
                  <div className="flex items-start gap-3 mb-4">
                    {payment.paymentMethod === "card" ? (
                      <CreditCard className="h-5 w-5 text-gray-600 mt-0.5 shrink-0" />
                    ) : (
                      <Wallet className="h-5 w-5 text-gray-600 mt-0.5 shrink-0" />
                    )}
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-gray-900 mb-2">
                        Payment Method
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600">
                        {payment.paymentMethod === "card"
                          ? `Card ending in ${payment.cardDetails?.cardNumber.slice(-4) || "****"}`
                          : "Cash on Delivery"}
                      </p>
                      {payment.paymentMethod === "card" && payment.cardDetails && (
                        <p className="text-sm text-gray-500 mt-1">
                          {payment.cardDetails.cardHolderName}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Order Total */}
                <div>
                  <div className="flex items-center justify-between py-4 border-t border-gray-200">
                    <span className="text-base sm:text-lg font-semibold text-gray-900">
                      Order Total
                    </span>
                    <span className="text-xl sm:text-2xl font-bold text-gray-900">
                      Rs. {orderTotal}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={handleContinueShopping}
                className="w-full sm:w-auto px-8 py-6 bg-green-500 text-white hover:bg-green-600 text-base sm:text-lg font-semibold rounded-md"
                size="lg"
              >
                Continue Shopping
              </Button>
            </div>

            {/* Additional Info */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                We'll send you a confirmation email with your order details.
              </p>
              <p className="text-sm text-gray-600 mt-2">
                For any questions, please contact our support team.
              </p>
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
};

export default OrderConfirmationPage;

