import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import Shipment from "../models/shipment.model.js";
import Order from "../models/order.model.js";
import User from "../models/user.model.js";
import type { ISHIPMENT } from "../models/shipment.model.js";
import type {
  CreateShipmentInput,
  UpdateShipmentStatusInput,
} from "../validator/order.schema.js";

export const createShipmentService = async (
  farmerId: string,
  data: CreateShipmentInput
): Promise<ISHIPMENT> => {
  if (!farmerId) {
    throw new ApiError(400, "Farmer ID is required");
  }

  // Get order and verify it belongs to this farmer
  const order = await Order.findOne({
    _id: new mongoose.Types.ObjectId(data.orderId),
    farmerId: new mongoose.Types.ObjectId(farmerId),
  }).populate("customerId");

  if (!order) {
    throw new ApiError(404, "Order not found or does not belong to this farmer");
  }

  // Check if shipment already exists for this order
  const existingShipment = await Shipment.findOne({
    orderId: new mongoose.Types.ObjectId(data.orderId),
  });

  if (existingShipment) {
    throw new ApiError(400, "Shipment already exists for this order");
  }

  // Get customer name from order
  const customer = order.customerId as any;
  const customerName = customer
    ? `${customer.fullName.firstName} ${customer.fullName.lastName}`
    : "Unknown Customer";

  // Create shipment
  const shipment = new Shipment({
    orderId: new mongoose.Types.ObjectId(data.orderId),
    customerName,
    customerAddress: order.shippingAddress,
    status: "pending",
    expectedDeliveryDate: new Date(data.expectedDeliveryDate),
    trackingNumber: data.trackingNumber || undefined,
    carrier: data.carrier || undefined,
    farmerId: new mongoose.Types.ObjectId(farmerId),
  });

  await shipment.save();

  // Update order status to "shipped" if not already
  if (order.status !== "shipped" && order.status !== "delivered") {
    order.status = "shipped";
    await order.save();
  }

  return shipment;
};

export const updateShipmentStatusService = async (
  shipmentId: string,
  farmerId: string,
  data: UpdateShipmentStatusInput
): Promise<ISHIPMENT> => {
  if (!shipmentId) {
    throw new ApiError(400, "Shipment ID is required");
  }

  if (!farmerId) {
    throw new ApiError(400, "Farmer ID is required");
  }

  const shipment = await Shipment.findOne({
    _id: new mongoose.Types.ObjectId(shipmentId),
    farmerId: new mongoose.Types.ObjectId(farmerId),
  });

  if (!shipment) {
    throw new ApiError(404, "Shipment not found");
  }

  shipment.status = data.status as any;

  if (data.trackingNumber) {
    shipment.trackingNumber = data.trackingNumber;
  }

  if (data.carrier) {
    shipment.carrier = data.carrier;
  }

  // Auto-update delivery date when status changes to delivered
  if (data.status === "delivered" && !shipment.actualDeliveryDate) {
    shipment.actualDeliveryDate = new Date();
    
    // Update order status to delivered
    await Order.findByIdAndUpdate(shipment.orderId, {
      status: "delivered",
    });
  }

  await shipment.save();

  return shipment;
};

