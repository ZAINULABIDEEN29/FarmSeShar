import type { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware.js";
import { ApiError } from "../utils/ApiError.js";
import { createOrderService, updateOrderStatusService } from "../services/order.service.js";
import { createShipmentService, updateShipmentStatusService } from "../services/shipment.service.js";
import {
  createOrderSchema,
  updateOrderStatusSchema,
  createShipmentSchema,
  updateShipmentStatusSchema,
} from "../validator/order.schema.js";
import { ZodError } from "zod";



export const createOrder = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const userId = req.user?._id?.toString();
    if (!userId) {
      throw new ApiError(401, "Unauthorized: User not authenticated");
    }
    let orderData;
    try {
      orderData = createOrderSchema.parse(req.body);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new ApiError(400, "Invalid order data", error.issues);
      }
      throw error;
    }
    const order = await createOrderService(userId, orderData);
    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: order,
    });
  }
);


export const updateOrderStatus = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const farmerId = req.farmer?._id?.toString();
    const orderId = req.params.id;
    if (!farmerId) {
      throw new ApiError(401, "Unauthorized: Farmer not authenticated");
    }
    let updateData;
    try {
      updateData = updateOrderStatusSchema.parse(req.body);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new ApiError(400, "Invalid status data", error.issues);
      }
      throw error;
    }
    const order = await updateOrderStatusService(orderId, farmerId, updateData.status);
    return res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      data: order,
    });
  }
);


export const createShipment = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const farmerId = req.farmer?._id?.toString();
    if (!farmerId) {
      throw new ApiError(401, "Unauthorized: Farmer not authenticated");
    }
    let shipmentData;
    try {
      shipmentData = createShipmentSchema.parse(req.body);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new ApiError(400, "Invalid shipment data", error.issues);
      }
      throw error;
    }
    const shipment = await createShipmentService(farmerId, shipmentData);
    return res.status(201).json({
      success: true,
      message: "Shipment created successfully",
      data: shipment,
    });
  }
);


export const updateShipmentStatus = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const farmerId = req.farmer?._id?.toString();
    const shipmentId = req.params.id;
    if (!farmerId) {
      throw new ApiError(401, "Unauthorized: Farmer not authenticated");
    }
    let updateData;
    try {
      updateData = updateShipmentStatusSchema.parse(req.body);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new ApiError(400, "Invalid status data", error.issues);
      }
      throw error;
    }
    const shipment = await updateShipmentStatusService(
      shipmentId,
      farmerId,
      updateData
    );
    return res.status(200).json({
      success: true,
      message: "Shipment status updated successfully",
      data: shipment,
    });
  }
);
