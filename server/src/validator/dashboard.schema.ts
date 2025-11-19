import { z } from "zod";
export const dashboardStatsQuerySchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
}).optional();
export const dashboardCustomersQuerySchema = z.object({
  search: z.string().optional(),
  page: z.string().regex(/^\d+$/).transform(Number).optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
}).optional();
export const dashboardOrdersQuerySchema = z.object({
  search: z.string().optional(),
  status: z.enum(["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"]).optional(),
  page: z.string().regex(/^\d+$/).transform(Number).optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
}).optional();
export const dashboardShipmentsQuerySchema = z.object({
  search: z.string().optional(),
  status: z.enum(["pending", "preparing", "in_transit", "out_for_delivery", "delivered", "cancelled"]).optional(),
  page: z.string().regex(/^\d+$/).transform(Number).optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
}).optional();
export type DashboardStatsQuery = z.infer<typeof dashboardStatsQuerySchema>;
export type DashboardCustomersQuery = z.infer<typeof dashboardCustomersQuerySchema>;
export type DashboardOrdersQuery = z.infer<typeof dashboardOrdersQuerySchema>;
export type DashboardShipmentsQuery = z.infer<typeof dashboardShipmentsQuerySchema>;
