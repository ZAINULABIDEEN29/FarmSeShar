import api from "./api";
import type { CartItem } from "@/types/cart.types";

export interface CartResponse {
  success: boolean;
  cart: {
    _id: string;
    userId: string;
    items: Array<{
      productId: string;
      name: string;
      price: number;
      quantity: number;
      unit: string;
      image?: string;
    }>;
    createdAt?: string;
    updatedAt?: string;
  };
  message?: string;
}

export interface AddToCartInput {
  productId: string;
  quantity: number;
}

export interface UpdateCartItemInput {
  quantity: number;
}

// Cart API Service Layer
export const cartService = {
  // Get user's cart
  getCart: async (): Promise<CartResponse["cart"]> => {
    const response = await api.get<CartResponse>("/cart");
    return response.data.cart;
  },

  // Add item to cart
  addToCart: async (data: AddToCartInput): Promise<CartResponse> => {
    const response = await api.post<CartResponse>("/cart/add", data);
    return response.data;
  },

  // Update cart item quantity
  updateCartItem: async (
    productId: string,
    data: UpdateCartItemInput
  ): Promise<CartResponse> => {
    const response = await api.put<CartResponse>(
      `/cart/items/${productId}`,
      data
    );
    return response.data;
  },

  // Remove item from cart
  removeFromCart: async (productId: string): Promise<CartResponse> => {
    const response = await api.delete<CartResponse>(
      `/cart/items/${productId}`
    );
    return response.data;
  },

  // Clear entire cart
  clearCart: async (): Promise<CartResponse> => {
    const response = await api.delete<CartResponse>("/cart/clear");
    return response.data;
  },
};

