import api from "./api";
import type { ShipmentStatus } from "@/types/dashboard.types";

export interface CreateShipmentInput {
  orderId: string;
  expectedDeliveryDate: string;
  trackingNumber?: string;
  carrier?: string;
}

export interface UpdateShipmentStatusInput {
  status: ShipmentStatus;
  trackingNumber?: string;
  carrier?: string;
}

export const shipmentService = {
  createShipment: async (data: CreateShipmentInput): Promise<{ success: boolean; data: any }> => {
    const response = await api.post<{ success: boolean; data: any }>(
      `/farmers/shipments`,
      data
    );
    return response.data;
  },
  updateShipmentStatus: async (
    shipmentId: string,
    data: UpdateShipmentStatusInput
  ): Promise<{ success: boolean; data: any }> => {
    const response = await api.patch<{ success: boolean; data: any }>(
      `/farmers/shipments/${shipmentId}/status`,
      data
    );
    return response.data;
  },
};

