import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { cartService, type AddToCartInput, type UpdateCartItemInput } from "@/services/cart.service";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearCart as clearCartAction, setCart, removeItem, updateQuantity } from "@/store/slices/cartSlice";
import type { CartItem } from "@/types/cart.types";

// Query Keys
export const cartKeys = {
  all: ["cart"] as const,
  cart: () => [...cartKeys.all, "user"] as const,
};

// Get user's cart
export const useGetCart = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  
  return useQuery({
    queryKey: cartKeys.cart(),
    queryFn: () => cartService.getCart(),
    enabled: isAuthenticated, // Only fetch if user is authenticated
    staleTime: 0, // Always fetch fresh cart data
  });
};

// Add to cart mutation
export const useAddToCart = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: (data: AddToCartInput) => {
      // Validate productId
      if (!data.productId) {
        throw new Error("Product ID is required");
      }
      return cartService.addToCart(data);
    },
    onSuccess: async (response) => {
      toast.success(response.message || "Item added to cart!");
      
      // Sync entire cart with Redux store immediately from response
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
      
      // Invalidate and refetch cart query to ensure consistency
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

// Update cart item mutation
export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: ({ productId, data }: { productId: string; data: UpdateCartItemInput }) =>
      cartService.updateCartItem(productId, data),
    onSuccess: (response) => {
      toast.success(response.message || "Cart updated!");
      queryClient.invalidateQueries({ queryKey: cartKeys.cart() });
      
      // Sync entire cart with Redux store
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

// Remove from cart mutation
export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: (productId: string) => cartService.removeFromCart(productId),
    onSuccess: (response) => {
      toast.success(response.message || "Item removed from cart!");
      queryClient.invalidateQueries({ queryKey: cartKeys.cart() });
      
      // Sync entire cart with Redux store
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

// Clear cart mutation
export const useClearCart = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: () => cartService.clearCart(),
    onSuccess: (response) => {
      toast.success(response.message || "Cart cleared!");
      queryClient.invalidateQueries({ queryKey: cartKeys.cart() });
      
      // Sync with Redux store
      dispatch(clearCartAction());
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || error.message || "Failed to clear cart.";
      toast.error(errorMessage);
    },
  });
};

