import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/services/dashboard.service";
import type {
  DashboardStatsQuery,
  DashboardCustomersQuery,
  DashboardOrdersQuery,
  DashboardShipmentsQuery,
} from "@/types/dashboard.types";

// Query Keys
export const dashboardKeys = {
  all: ["dashboard"] as const,
  stats: (filters?: DashboardStatsQuery) =>
    [...dashboardKeys.all, "stats", filters] as const,
  customers: (filters?: DashboardCustomersQuery) =>
    [...dashboardKeys.all, "customers", filters] as const,
  orders: (filters?: DashboardOrdersQuery) =>
    [...dashboardKeys.all, "orders", filters] as const,
  shipments: (filters?: DashboardShipmentsQuery) =>
    [...dashboardKeys.all, "shipments", filters] as const,
};

// Get dashboard statistics
export const useDashboardStats = (filters?: DashboardStatsQuery) => {
  return useQuery({
    queryKey: dashboardKeys.stats(filters),
    queryFn: () => dashboardService.getDashboardStats(filters),
    staleTime: 1 * 60 * 1000, // 1 minute
    refetchOnWindowFocus: false,
  });
};

// Get customers
export const useDashboardCustomers = (
  filters?: DashboardCustomersQuery,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: dashboardKeys.customers(filters),
    queryFn: () => dashboardService.getCustomers(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false,
    enabled: options?.enabled !== false,
  });
};

// Get orders
export const useDashboardOrders = (
  filters?: DashboardOrdersQuery,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: dashboardKeys.orders(filters),
    queryFn: () => dashboardService.getOrders(filters),
    staleTime: 1 * 60 * 1000, // 1 minute
    refetchOnWindowFocus: false,
    enabled: options?.enabled !== false,
  });
};

// Get shipments
export const useDashboardShipments = (
  filters?: DashboardShipmentsQuery,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: dashboardKeys.shipments(filters),
    queryFn: () => dashboardService.getShipments(filters),
    staleTime: 1 * 60 * 1000, // 1 minute
    refetchOnWindowFocus: false,
    enabled: options?.enabled !== false,
  });
};

