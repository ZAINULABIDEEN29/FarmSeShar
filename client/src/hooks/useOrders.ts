import { useMutation, useQueryClient } from "@tanstack/react-query";
import { orderService } from "@/services/order.service";
import { dashboardKeys } from "./useDashboard";
import type { OrderStatus } from "@/types/dashboard.types";
import { toast } from "react-toastify";

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: OrderStatus }) =>
      orderService.updateOrderStatus(orderId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dashboardKeys.orders() });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.stats() });
      toast.success("Order status updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update order status");
    },
  });
};

