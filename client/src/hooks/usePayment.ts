import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { paymentService, type CreatePaymentIntentInput, type ConfirmPaymentInput } from "@/services/payment.service";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/store/hooks";
import { clearCart } from "@/store/slices/cartSlice";

// Create payment intent mutation
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

// Confirm payment mutation
export const useConfirmPayment = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: (data: ConfirmPaymentInput) =>
      paymentService.confirmPayment(data),
    onSuccess: (response) => {
      toast.success(response.message || "Payment confirmed!");
      dispatch(clearCart());
      // Navigate to order confirmation page
      navigate(`/order-confirmation/${response.order._id}`);
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || error.message || "Payment confirmation failed.";
      toast.error(errorMessage);
    },
  });
};

