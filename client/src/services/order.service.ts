import api from "./api";
import type { CheckoutAddress } from "@/types/checkout.types";
import type { PaymentData } from "@/types/payment.types";
import type { CartItem } from "@/types/cart.types";

export interface CreateOrderInput {
  items: {
    productId: string;
    productName: string;
    quantity: number;
    unit: string;
    price: number;
    total: number;
  }[];
  shippingAddress: CheckoutAddress;
  paymentMethod: "card" | "cash";
}

export interface OrderResponse {
  success: boolean;
  message: string;
  data: {
    _id: string;
    orderId: string;
    customerId: string;
    items: any[];
    totalAmount: number;
    status: string;
    shippingAddress: CheckoutAddress;
    paymentMethod: "card" | "cash";
    createdAt: string;
  };
}

// Order API Service Layer
export const orderService = {
  // Create a new order
  createOrder: async (data: CreateOrderInput): Promise<OrderResponse> => {
    const response = await api.post<OrderResponse>("/users/orders", data);
    return response.data;
  },
};

// Helper function to convert cart items to order items
export const cartItemsToOrderItems = (
  cartItems: CartItem[]
): CreateOrderInput["items"] => {
  return cartItems.map((item) => ({
    productId: item.id,
    productName: item.name,
    quantity: item.quantity,
    unit: item.unit,
    price: item.price,
    total: item.price * item.quantity,
  }));
};

