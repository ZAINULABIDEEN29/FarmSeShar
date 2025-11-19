import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import type { IORDER } from "../models/order.model.js";
import type { CreateOrderInput } from "../validator/order.schema.js";
export const createOrderService = async (
  userId: string,
  data: CreateOrderInput
): Promise<IORDER> => {
  if (!userId) {
    throw new ApiError(400, "User ID is required");
  }
  const productIds = data.items.map((item: any) => new mongoose.Types.ObjectId(item.productId));
  const products = await Product.find({ _id: { $in: productIds } }).lean();
  if (products.length !== data.items.length) {
    throw new ApiError(400, "Some products not found");
  }
  for (const item of data.items) {
    const product = products.find(
      (p: any) => p._id.toString() === item.productId
    );
    if (!product) {
      throw new ApiError(400, `Product ${item.productId} not found`);
    }
    if (!product.isAvailable) {
      throw new ApiError(400, `Product ${product.name} is not available`);
    }
    if (product.quantity < item.quantity) {
      throw new ApiError(400, `Insufficient stock for ${product.name}`);
    }
  }
  const totalAmount = data.items.reduce((sum: number, item: any) => sum + item.total, 0);
  const firstProduct = products[0];
  const farmerId = firstProduct.farmerId;
  const order = new Order({
    orderId: `TEMP-${Date.now()}`,
    customerId: new mongoose.Types.ObjectId(userId),
    items: data.items.map((item: any) => ({
      ...item,
      productId: new mongoose.Types.ObjectId(item.productId),
    })),
    totalAmount,
    status: "pending",
    shippingAddress: data.shippingAddress,
    paymentMethod: data.paymentMethod,
    farmerId: farmerId ? new mongoose.Types.ObjectId(farmerId.toString()) : undefined,
  });
  await order.save();
  for (const item of data.items) {
    await Product.findByIdAndUpdate(item.productId, {
      $inc: { quantity: -item.quantity },
    });
  }
  for (const item of data.items) {
    const product = await Product.findById(item.productId);
    if (product && product.quantity === 0) {
      product.isAvailable = false;
      await product.save();
    }
  }
  return order;
};
export const updateOrderStatusService = async (
  orderId: string,
  farmerId: string,
  status: string
): Promise<IORDER> => {
  if (!orderId) {
    throw new ApiError(400, "Order ID is required");
  }
  if (!farmerId) {
    throw new ApiError(400, "Farmer ID is required");
  }
  const order = await Order.findOne({
    _id: new mongoose.Types.ObjectId(orderId),
    farmerId: new mongoose.Types.ObjectId(farmerId),
  });
  if (!order) {
    throw new ApiError(404, "Order not found");
  }
  order.status = status as any;
  await order.save();
  return order;
};
