import api from "./api";
import type {
  DashboardStats,
  Customer,
  Order,
  Shipment,
  DashboardStatsQuery,
  DashboardCustomersQuery,
  DashboardOrdersQuery,
  DashboardShipmentsQuery,
} from "@/types/dashboard.types";
export const dashboardService = {
  getDashboardStats: async (filters?: DashboardStatsQuery): Promise<DashboardStats> => {
    const params = new URLSearchParams();
    if (filters?.startDate) params.append("startDate", filters.startDate);
    if (filters?.endDate) params.append("endDate", filters.endDate);
    const queryString = params.toString();
    const url = `/farmers/dashboard/stats${queryString ? `?${queryString}` : ""}`;
    const response = await api.get<{ success: boolean; data: DashboardStats }>(url);
    return response.data.data;
  },
  getCustomers: async (
    filters?: DashboardCustomersQuery
  ): Promise<{ customers: Customer[]; pagination: any }> => {
    const params = new URLSearchParams();
    if (filters?.search) params.append("search", filters.search);
    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.limit) params.append("limit", filters.limit.toString());
    const queryString = params.toString();
    const url = `/farmers/dashboard/customers${queryString ? `?${queryString}` : ""}`;
    const response = await api.get<{
      success: boolean;
      data: Customer[];
      pagination: any;
    }>(url);
    return {
      customers: response.data.data,
      pagination: response.data.pagination,
    };
  },
  getOrders: async (
    filters?: DashboardOrdersQuery
  ): Promise<{ orders: Order[]; pagination: any }> => {
    const params = new URLSearchParams();
    if (filters?.search) params.append("search", filters.search);
    if (filters?.status) params.append("status", filters.status);
    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.limit) params.append("limit", filters.limit.toString());
    if (filters?.startDate) params.append("startDate", filters.startDate);
    if (filters?.endDate) params.append("endDate", filters.endDate);
    const queryString = params.toString();
    const url = `/farmers/dashboard/orders${queryString ? `?${queryString}` : ""}`;
    const response = await api.get<{
      success: boolean;
      data: Order[];
      pagination: any;
    }>(url);
    return {
      orders: response.data.data,
      pagination: response.data.pagination,
    };
  },
  getShipments: async (
    filters?: DashboardShipmentsQuery
  ): Promise<{ shipments: Shipment[]; pagination: any }> => {
    const params = new URLSearchParams();
    if (filters?.search) params.append("search", filters.search);
    if (filters?.status) params.append("status", filters.status);
    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.limit) params.append("limit", filters.limit.toString());
    if (filters?.startDate) params.append("startDate", filters.startDate);
    if (filters?.endDate) params.append("endDate", filters.endDate);
    const queryString = params.toString();
    const url = `/farmers/dashboard/shipments${queryString ? `?${queryString}` : ""}`;
    const response = await api.get<{
      success: boolean;
      data: Shipment[];
      pagination: any;
    }>(url);
    return {
      shipments: response.data.data,
      pagination: response.data.pagination,
    };
  },
};
