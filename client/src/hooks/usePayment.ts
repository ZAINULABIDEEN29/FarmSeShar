import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { paymentService, type CreatePaymentIntentInput, type ConfirmPaymentInput } from "@/services/payment.service";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/store/hooks";
import { clearCart } from "@/store/slices/cartSlice";
export const useCreatePaymentIntent = () => {
  return useMutation({
    mutationFn: (data: CreatePaymentIntentInput) =>
      paymentService.createPaymentIntent(data),
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || error.message || "Failed to create payment.";
      toast.error(errorMessage);
    },
  });
};
export const useConfirmPayment = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  return useMutation({
    mutationFn: (data: ConfirmPaymentInput) =>
      paymentService.confirmPayment(data),
    onSuccess: (response) => {
      dispatch(clearCart());
      // Don't navigate here - let the component handle navigation with order data
      return response;
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || 
        (error.response?.data?.errors && Array.isArray(error.response.data.errors)
          ? error.response.data.errors.map((e: any) => e.message).join(", ")
          : null) ||
        error.message || 
        "Payment confirmation failed.";
      toast.error(errorMessage);
    },
  });
};
