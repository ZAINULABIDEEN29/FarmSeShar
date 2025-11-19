import type { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware.js";
import { ApiError } from "../utils/ApiError.js";
import {
  getDashboardStatsService,
  getDashboardCustomersService,
  getDashboardOrdersService,
  getDashboardShipmentsService,
} from "../services/dashboard.service.js";
import {
  dashboardStatsQuerySchema,
  dashboardCustomersQuerySchema,
  dashboardOrdersQuerySchema,
  dashboardShipmentsQuerySchema,
} from "../validator/dashboard.schema.js";
import { ZodError } from "zod";
export const getDashboardStats = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const farmerId = req.farmer?._id?.toString();
    if (!farmerId) {
      throw new ApiError(401, "Unauthorized: Farmer not authenticated");
    }
    let filters;
    try {
      filters = dashboardStatsQuerySchema.parse(req.query);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new ApiError(400, "Invalid query parameters", error.issues);
      }
      throw error;
    }
    const stats = await getDashboardStatsService(farmerId, filters);
    return res.status(200).json({
      success: true,
      message: "Dashboard statistics retrieved successfully",
      data: stats,
    });
  }
);
export const getDashboardCustomers = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const farmerId = req.farmer?._id?.toString();
    if (!farmerId) {
      throw new ApiError(401, "Unauthorized: Farmer not authenticated");
    }
    let filters;
    try {
      filters = dashboardCustomersQuerySchema.parse(req.query);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new ApiError(400, "Invalid query parameters", error.issues);
      }
      throw error;
    }
    const result = await getDashboardCustomersService(farmerId, filters);
    return res.status(200).json({
      success: true,
      message: "Customers retrieved successfully",
      data: result.customers,
      pagination: {
        page: filters?.page || 1,
        limit: filters?.limit || 10,
        total: result.total,
        pages: Math.ceil(result.total / (filters?.limit || 10)),
      },
    });
  }
);
export const getDashboardOrders = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const farmerId = req.farmer?._id?.toString();
    if (!farmerId) {
      throw new ApiError(401, "Unauthorized: Farmer not authenticated");
    }
    let filters;
    try {
      filters = dashboardOrdersQuerySchema.parse(req.query);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new ApiError(400, "Invalid query parameters", error.issues);
      }
      throw error;
    }
    const result = await getDashboardOrdersService(farmerId, filters);
    return res.status(200).json({
      success: true,
      message: "Orders retrieved successfully",
      data: result.orders,
      pagination: {
        page: filters?.page || 1,
        limit: filters?.limit || 10,
        total: result.total,
        pages: Math.ceil(result.total / (filters?.limit || 10)),
      },
    });
  }
);
export const getDashboardShipments = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const farmerId = req.farmer?._id?.toString();
    if (!farmerId) {
      throw new ApiError(401, "Unauthorized: Farmer not authenticated");
    }
    let filters;
    try {
      filters = dashboardShipmentsQuerySchema.parse(req.query);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new ApiError(400, "Invalid query parameters", error.issues);
      }
      throw error;
    }
    const result = await getDashboardShipmentsService(farmerId, filters);
    return res.status(200).json({
      success: true,
      message: "Shipments retrieved successfully",
      data: result.shipments,
      pagination: {
        page: filters?.page || 1,
        limit: filters?.limit || 10,
        total: result.total,
        pages: Math.ceil(result.total / (filters?.limit || 10)),
      },
    });
  }
);
