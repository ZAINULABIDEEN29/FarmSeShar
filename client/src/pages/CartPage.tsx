import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import Container from "@/components/container/Container";
import { CartItem, OrderSummary } from "@/components/cart";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import {
  selectCartItems,
  selectCartTotal,
  selectCartItemCount,
  setCart,
  applyPromoCode,
} from "@/store/slices/cartSlice";
import { useGetCart, useUpdateCartItem, useRemoveFromCart } from "@/hooks/useCart";
import { ShoppingBag } from "lucide-react";
import { toast } from "react-toastify";
import Loader from "@/components/common/Loader";

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector(selectCartItems);
  const cartTotals = useAppSelector(selectCartTotal);
  const cartItemCount = useAppSelector(selectCartItemCount);
  const discountPercentage = useAppSelector((state) => state.cart.discount);
  const promoCode = useAppSelector((state) => state.cart.promoCode);
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  // Fetch cart from API if user is authenticated
  const { data: cartData, isLoading: isLoadingCart } = useGetCart();
  const updateCartItem = useUpdateCartItem();
  const removeFromCart = useRemoveFromCart();

  // Sync cart from API to Redux store
  useEffect(() => {
    if (isAuthenticated && cartData?.items) {
      const cartItems = cartData.items.map((item) => ({
        id: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        unit: item.unit,
        image: item.image,
      }));
      dispatch(setCart(cartItems));
    } else if (!isAuthenticated) {
      // Clear cart if user is not authenticated
      dispatch(setCart([]));
    }
  }, [cartData, isAuthenticated, dispatch]);

  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (!isAuthenticated) {
      toast.error("Please login to update cart");
      navigate("/login", { state: { from: "/cart" } });
      return;
    }

    if (quantity <= 0) {
      handleRemoveItem(id);
      return;
    }

    updateCartItem.mutate(
      { productId: id, data: { quantity } },
      {
        onError: () => {
          // Error is handled in the hook
        },
      }
    );
  };

  const handleRemoveItem = (id: string) => {
    if (!isAuthenticated) {
      toast.error("Please login to remove items from cart");
      navigate("/login", { state: { from: "/cart" } });
      return;
    }

    removeFromCart.mutate(id, {
      onError: () => {
        // Error is handled in the hook
      },
    });
  };

  const handleApplyPromoCode = (code: string) => {
    dispatch(applyPromoCode(code));
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.error("Please login to continue with checkout");
      navigate("/login", { state: { from: "/cart" } });
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    navigate("/checkout");
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  const handleAccountClick = () => {
    navigate("/login");
  };

  const handleCartClick = () => {
    navigate("/cart");
  };

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
              Your Cart
            </h1>
          </div>

          {isLoadingCart && isAuthenticated ? (
            <div className="flex justify-center items-center py-12">
              <Loader />
            </div>
          ) : cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 sm:py-24">
              <ShoppingBag className="h-16 w-16 sm:h-24 sm:w-24 text-gray-400 mb-4" />
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
                Your cart is empty
              </h2>
              <p className="text-gray-600 mb-6 text-center px-4">
                {isAuthenticated
                  ? "Start adding items to your cart to see them here."
                  : "Please login to add items to your cart."}
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
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onUpdateQuantity={handleUpdateQuantity}
                    onRemove={handleRemoveItem}
                  />
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <OrderSummary
                  subtotal={cartTotals.subtotal}
                  discount={cartTotals.discount}
                  discountPercentage={discountPercentage}
                  deliveryFee={cartTotals.deliveryFee}
                  total={cartTotals.total}
                  onApplyPromoCode={handleApplyPromoCode}
                  onCheckout={handleCheckout}
                  promoCode={promoCode}
                />
              </div>
            </div>
          )}
        </Container>
      </main>

      <Footer />
    </div>
  );
};

export default CartPage;

