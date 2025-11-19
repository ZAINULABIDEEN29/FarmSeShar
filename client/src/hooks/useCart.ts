import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { cartService, type AddToCartInput, type UpdateCartItemInput } from "@/services/cart.service";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearCart as clearCartAction, setCart } from "@/store/slices/cartSlice";
import type { CartItem } from "@/types/cart.types";
export const cartKeys = {
  all: ["cart"] as const,
  cart: () => [...cartKeys.all, "user"] as const,
};
export const useGetCart = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  return useQuery({
    queryKey: cartKeys.cart(),
    queryFn: () => cartService.getCart(),
    enabled: isAuthenticated,
    staleTime: 0,
  });
};
export const useAddToCart = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  return useMutation({
    mutationFn: (data: AddToCartInput) => {
      if (!data.productId) {
        throw new Error("Product ID is required");
      }
      return cartService.addToCart(data);
    },
    onSuccess: async (response) => {
      toast.success(response.message || "Item added to cart!");
      if (response.cart && response.cart.items) {
        const cartItems: CartItem[] = response.cart.items.map((item) => ({
          id: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          unit: item.unit,
          image: item.image,
        }));
        dispatch(setCart(cartItems));
      }
      await queryClient.invalidateQueries({ queryKey: cartKeys.cart() });
      await queryClient.refetchQueries({ queryKey: cartKeys.cart() });
    },
    onError: (error: any) => {
      console.error("Add to cart error:", error);
      const errorMessage =
        error.response?.data?.message || 
        error.message || 
        "Failed to add item to cart. Please try again.";
      toast.error(errorMessage);
    },
  });
};
export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  return useMutation({
    mutationFn: ({ productId, data }: { productId: string; data: UpdateCartItemInput }) =>
      cartService.updateCartItem(productId, data),
    onSuccess: (response) => {
      toast.success(response.message || "Cart updated!");
      queryClient.invalidateQueries({ queryKey: cartKeys.cart() });
      const cartItems: CartItem[] = response.cart.items.map((item) => ({
        id: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        unit: item.unit,
        image: item.image,
      }));
      dispatch(setCart(cartItems));
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || error.message || "Failed to update cart.";
      toast.error(errorMessage);
    },
  });
};
export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  return useMutation({
    mutationFn: (productId: string) => cartService.removeFromCart(productId),
    onSuccess: (response) => {
      toast.success(response.message || "Item removed from cart!");
      queryClient.invalidateQueries({ queryKey: cartKeys.cart() });
      const cartItems: CartItem[] = response.cart.items.map((item) => ({
        id: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        unit: item.unit,
        image: item.image,
      }));
      dispatch(setCart(cartItems));
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || error.message || "Failed to remove item.";
      toast.error(errorMessage);
    },
  });
};
export const useClearCart = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  return useMutation({
    mutationFn: () => cartService.clearCart(),
    onSuccess: (response) => {
      toast.success(response.message || "Cart cleared!");
      queryClient.invalidateQueries({ queryKey: cartKeys.cart() });
      dispatch(clearCartAction());
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || error.message || "Failed to clear cart.";
      toast.error(errorMessage);
    },
  });
};
export const useCartRestore = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, userType, isRestoring } = useAppSelector((state) => state.auth);
  const isRestoredRef = React.useRef(false);
  const lastAuthStateRef = React.useRef<{ isAuthenticated: boolean; userType: string | null }>({
    isAuthenticated: false,
    userType: null,
  });
  React.useEffect(() => {
    const currentAuthState = { isAuthenticated, userType };
    if (
      lastAuthStateRef.current.isAuthenticated !== isAuthenticated ||
      lastAuthStateRef.current.userType !== userType
    ) {
      isRestoredRef.current = false;
      lastAuthStateRef.current = currentAuthState;
    }
    if (isRestoring) {
      return;
    }
    if (isRestoredRef.current || !isAuthenticated || userType !== "user") {
      if (!isAuthenticated) {
        dispatch(setCart([]));
      }
      return;
    }
    const restoreCart = async () => {
      isRestoredRef.current = true;
      try {
        const cartData = await cartService.getCart();
        if (cartData?.items && cartData.items.length > 0) {
          const cartItems: CartItem[] = cartData.items.map((item) => ({
            id: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            unit: item.unit,
            image: item.image,
          }));
          dispatch(setCart(cartItems));
        } else {
          dispatch(setCart([]));
        }
      } catch (error) {
        console.error("Failed to restore cart:", error);
        dispatch(setCart([]));
      }
    };
    restoreCart();
  }, [isAuthenticated, userType, isRestoring, dispatch]);
};
