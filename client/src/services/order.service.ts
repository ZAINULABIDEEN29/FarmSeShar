import api from "./api";
import type { OrderStatus } from "@/types/dashboard.types";

export const orderService = {
  updateOrderStatus: async (orderId: string, status: OrderStatus): Promise<{ success: boolean; data: any }> => {
    const response = await api.patch<{ success: boolean; data: any }>(
      `/farmers/orders/${orderId}/status`,
      { status }
    );
    return response.data;
  },
};
