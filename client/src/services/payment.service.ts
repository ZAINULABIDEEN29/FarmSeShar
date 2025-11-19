import api from "./api";
import type { ShippingAddress } from "@/types/checkout.types";
export interface CreatePaymentIntentInput {
  shippingAddress: ShippingAddress;
  paymentMethod: "card" | "cash";
}
export interface CreatePaymentIntentResponse {
  success: boolean;
  clientSecret: string;
  paymentIntentId: string;
}
export interface ConfirmPaymentInput {
  paymentIntentId: string;
  shippingAddress: ShippingAddress;
}
export interface ConfirmPaymentResponse {
  success: boolean;
  message: string;
  order: any;
}
export const paymentService = {
  createPaymentIntent: async (
    data: CreatePaymentIntentInput
  ): Promise<CreatePaymentIntentResponse> => {
    const response = await api.post<CreatePaymentIntentResponse>(
      "/payment/create-intent",
      data
    );
    return response.data;
  },
  confirmPayment: async (
    data: ConfirmPaymentInput
  ): Promise<ConfirmPaymentResponse> => {
    const response = await api.post<ConfirmPaymentResponse>(
      "/payment/confirm",
      data
    );
    return response.data;
  },
};
