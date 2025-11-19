import { useMutation, useQueryClient } from "@tanstack/react-query";
import { shipmentService, type CreateShipmentInput, type UpdateShipmentStatusInput } from "@/services/shipment.service";
import { dashboardKeys } from "./useDashboard";
import { toast } from "react-toastify";

export const useCreateShipment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateShipmentInput) => shipmentService.createShipment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dashboardKeys.shipments() });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.orders() });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.stats() });
      toast.success("Shipment created successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create shipment");
    },
  });
};

export const useUpdateShipmentStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ shipmentId, data }: { shipmentId: string; data: UpdateShipmentStatusInput }) =>
      shipmentService.updateShipmentStatus(shipmentId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dashboardKeys.shipments() });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.orders() });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.stats() });
      toast.success("Shipment status updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update shipment status");
    },
  });
};

