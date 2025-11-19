import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import Container from "@/components/container/Container";
import { CheckCircle, MapPin, CreditCard, Wallet } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { selectCartItemCount } from "@/store/slices/cartSlice";
import type { CheckoutAddress } from "@/types/checkout.types";
import { Button } from "@/components/ui/button";
interface LocationState {
  order?: {
    _id: string;
    orderId: string;
    totalAmount: number;
    status: string;
    paymentMethod: "card" | "cash";
    shippingAddress: CheckoutAddress;
    items: Array<{
      productName: string;
      quantity: number;
      unit: string;
      price: number;
      total: number;
    }>;
  };
  address?: CheckoutAddress;
  paymentMethod?: "card" | "cash";
}
const OrderConfirmationPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const cartItemCount = useAppSelector(selectCartItemCount);
  const { order, address, paymentMethod } = (location.state as LocationState) || {};
  
  // Use order data if available, otherwise fall back to location state
  const orderData = order || null;
  const shippingAddress = orderData?.shippingAddress || address;
  const orderTotal = orderData?.totalAmount || 0;
  const finalPaymentMethod = orderData?.paymentMethod || paymentMethod || "cash";
  
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
  React.useEffect(() => {
    if (!shippingAddress || !orderData) {
      // If no order data, redirect to home after a short delay
      const timer = setTimeout(() => {
        navigate("/");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [shippingAddress, orderData, navigate]);
  if (!shippingAddress || !orderData) {
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
            <div className="text-center py-12">
              <p className="text-gray-600">Loading order details...</p>
            </div>
          </Container>
        </main>
        <Footer />
      </div>
    );
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
            {}
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
            {}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 sm:p-8 mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
                Order Details
              </h2>
              <div className="space-y-6">
                {}
                <div className="border-b border-gray-200 pb-6">
                  <div className="flex items-start gap-3 mb-4">
                    <MapPin className="h-5 w-5 text-gray-600 mt-0.5 shrink-0" />
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-gray-900 mb-2">
                        Shipping Address
                      </h3>
                      <div className="text-sm sm:text-base text-gray-600 space-y-1">
                        <p>{shippingAddress.streetAddress}, {shippingAddress.houseNo}</p>
                        <p>{shippingAddress.town}, {shippingAddress.city}</p>
                        <p>{shippingAddress.country} - {shippingAddress.postalCode}</p>
                      </div>
                    </div>
                  </div>
                </div>
                {}
                <div className="border-b border-gray-200 pb-6">
                  <div className="flex items-start gap-3 mb-4">
                    {finalPaymentMethod === "card" ? (
                      <CreditCard className="h-5 w-5 text-gray-600 mt-0.5 shrink-0" />
                    ) : (
                      <Wallet className="h-5 w-5 text-gray-600 mt-0.5 shrink-0" />
                    )}
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-gray-900 mb-2">
                        Payment Method
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600">
                        {finalPaymentMethod === "card"
                          ? "Card Payment (Paid)"
                          : "Cash on Delivery"}
                      </p>
                      {finalPaymentMethod === "cash" && (
                        <p className="text-sm text-gray-500 mt-1">
                          Please have the exact amount ready when your order arrives.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                {}
                {orderData.items && orderData.items.length > 0 && (
                  <div className="border-b border-gray-200 pb-6">
                    <h3 className="text-base font-semibold text-gray-900 mb-4">
                      Order Items
                    </h3>
                    <div className="space-y-3">
                      {orderData.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {item.productName}
                            </p>
                            <p className="text-xs text-gray-500">
                              {item.quantity} {item.unit} × Rs. {item.price.toFixed(2)}
                            </p>
                          </div>
                          <p className="text-sm font-semibold text-gray-900">
                            Rs. {item.total.toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {}
                {orderData.orderId && (
                  <div className="border-b border-gray-200 pb-6">
                    <h3 className="text-base font-semibold text-gray-900 mb-2">
                      Order ID
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 font-mono">
                      {orderData.orderId}
                    </p>
                  </div>
                )}
                {}
                <div>
                  <div className="flex items-center justify-between py-4 border-t border-gray-200">
                    <span className="text-base sm:text-lg font-semibold text-gray-900">
                      Order Total
                    </span>
                    <span className="text-xl sm:text-2xl font-bold text-gray-900">
                      Rs. {orderTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={handleContinueShopping}
                className="w-full sm:w-auto px-8 py-6 bg-green-500 text-white hover:bg-green-600 text-base sm:text-lg font-semibold rounded-md"
                size="lg"
              >
                Continue Shopping
              </Button>
            </div>
            {}
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
