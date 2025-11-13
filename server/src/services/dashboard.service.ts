import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import Product from "../models/product.model.js";
import Order from "../models/order.model.js";
import Shipment from "../models/shipment.model.js";
import User from "../models/user.model.js";
import type { 
  DashboardStatsQuery, 
  DashboardCustomersQuery, 
  DashboardOrdersQuery, 
  DashboardShipmentsQuery 
} from "../validator/dashboard.schema.js";

// Statistics
export interface DashboardStats {
  totalProducts: number;
  availableProducts: number;
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalRevenue: number;
  pendingShipments: number;
  inTransitShipments: number;
  deliveredShipments: number;
  totalCustomers: number;
}

export const getDashboardStatsService = async (
  farmerId: string,
  filters?: DashboardStatsQuery
): Promise<DashboardStats> => {
  if (!farmerId) {
    throw new ApiError(400, "Farmer ID is required");
  }

  const farmerObjectId = new mongoose.Types.ObjectId(farmerId);

  // Date range filter
  const dateFilter: any = {};
  if (filters?.startDate || filters?.endDate) {
    dateFilter.createdAt = {};
    if (filters.startDate) {
      dateFilter.createdAt.$gte = new Date(filters.startDate);
    }
    if (filters.endDate) {
      dateFilter.createdAt.$lte = new Date(filters.endDate);
    }
  }

  // Get products count
  const [totalProducts, availableProducts] = await Promise.all([
    Product.countDocuments({ farmerId: farmerObjectId }),
    Product.countDocuments({ 
      farmerId: farmerObjectId, 
      isAvailable: true 
    }),
  ]);

  // Get orders statistics
  const orderQuery = { 
    farmerId: farmerObjectId,
    ...dateFilter,
  };

  const [
    totalOrders,
    pendingOrders,
    completedOrders,
    revenueResult,
  ] = await Promise.all([
    Order.countDocuments(orderQuery),
    Order.countDocuments({ 
      ...orderQuery, 
      status: { $in: ["pending", "confirmed", "processing"] } 
    }),
    Order.countDocuments({ 
      ...orderQuery, 
      status: "delivered" 
    }),
    Order.aggregate([
      { $match: { ...orderQuery, status: "delivered" } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]),
  ]);

  const totalRevenue = revenueResult[0]?.total || 0;

  // Get shipments statistics
  const shipmentQuery = { 
    farmerId: farmerObjectId,
    ...dateFilter,
  };

  const [
    pendingShipments,
    inTransitShipments,
    deliveredShipments,
  ] = await Promise.all([
    Shipment.countDocuments({ 
      ...shipmentQuery, 
      status: { $in: ["pending", "preparing"] } 
    }),
    Shipment.countDocuments({ 
      ...shipmentQuery, 
      status: { $in: ["in_transit", "out_for_delivery"] } 
    }),
    Shipment.countDocuments({ 
      ...shipmentQuery, 
      status: "delivered" 
    }),
  ]);

  // Get unique customers count
  const uniqueCustomers = await Order.distinct("customerId", orderQuery);
  const totalCustomers = uniqueCustomers.length;

  return {
    totalProducts,
    availableProducts,
    totalOrders,
    pendingOrders,
    completedOrders,
    totalRevenue,
    pendingShipments,
    inTransitShipments,
    deliveredShipments,
    totalCustomers,
  };
};

// Customers
export interface Customer {
  _id: string;
  fullName: {
    firstName: string;
    lastName: string;
  };
  email: string;
  phoneNumber: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate?: Date;
  createdAt?: Date;
}

export const getDashboardCustomersService = async (
  farmerId: string,
  filters?: DashboardCustomersQuery
): Promise<{ customers: Customer[]; total: number }> => {
  if (!farmerId) {
    throw new ApiError(400, "Farmer ID is required");
  }

  const farmerObjectId = new mongoose.Types.ObjectId(farmerId);
  const page = filters?.page || 1;
  const limit = filters?.limit || 10;
  const skip = (page - 1) * limit;

  // Get orders for this farmer
  const orderQuery: any = { farmerId: farmerObjectId };
  const orders = await Order.find(orderQuery).lean();

  // Group orders by customer
  const customerMap = new Map<string, {
    customerId: string;
    totalOrders: number;
    totalSpent: number;
    lastOrderDate?: Date;
  }>();

  for (const order of orders) {
    const customerId = order.customerId.toString();
    const existing = customerMap.get(customerId) || {
      customerId,
      totalOrders: 0,
      totalSpent: 0,
      lastOrderDate: undefined,
    };

    existing.totalOrders += 1;
    existing.totalSpent += order.totalAmount;
    if (!existing.lastOrderDate || order.createdAt! > existing.lastOrderDate) {
      existing.lastOrderDate = order.createdAt;
    }

    customerMap.set(customerId, existing);
  }

  // Get customer details
  const customerIds = Array.from(customerMap.keys()).map(
    (id) => new mongoose.Types.ObjectId(id)
  );

  let users = await User.find({ _id: { $in: customerIds } })
    .select("fullName email phoneNumber createdAt")
    .lean();

  // Apply search filter
  if (filters?.search) {
    const searchLower = filters.search.toLowerCase();
    users = users.filter((user) => {
      const fullName = `${user.fullName.firstName} ${user.fullName.lastName}`.toLowerCase();
      const email = user.email.toLowerCase();
      const phone = user.phoneNumber.toLowerCase();
      return (
        fullName.includes(searchLower) ||
        email.includes(searchLower) ||
        phone.includes(searchLower)
      );
    });
  }

  // Combine user data with order statistics
  const customers: Customer[] = users.map((user: any) => {
    const stats = customerMap.get(user._id.toString()) || {
      customerId: user._id.toString(),
      totalOrders: 0,
      totalSpent: 0,
      lastOrderDate: undefined,
    };

    return {
      _id: user._id.toString(),
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      totalOrders: stats.totalOrders,
      totalSpent: stats.totalSpent,
      lastOrderDate: stats.lastOrderDate,
      createdAt: (user as any).createdAt || undefined,
    };
  });

  // Sort by last order date (most recent first)
  customers.sort((a, b) => {
    if (!a.lastOrderDate && !b.lastOrderDate) return 0;
    if (!a.lastOrderDate) return 1;
    if (!b.lastOrderDate) return -1;
    return b.lastOrderDate.getTime() - a.lastOrderDate.getTime();
  });

  const total = customers.length;
  const paginatedCustomers = customers.slice(skip, skip + limit);

  return {
    customers: paginatedCustomers,
    total,
  };
};

// Orders
export const getDashboardOrdersService = async (
  farmerId: string,
  filters?: DashboardOrdersQuery
): Promise<{ orders: any[]; total: number }> => {
  if (!farmerId) {
    throw new ApiError(400, "Farmer ID is required");
  }

  const farmerObjectId = new mongoose.Types.ObjectId(farmerId);
  const page = filters?.page || 1;
  const limit = filters?.limit || 10;
  const skip = (page - 1) * limit;

  // Build query
  const query: any = { farmerId: farmerObjectId };

  if (filters?.status) {
    query.status = filters.status;
  }

  if (filters?.startDate || filters?.endDate) {
    query.createdAt = {};
    if (filters.startDate) {
      query.createdAt.$gte = new Date(filters.startDate);
    }
    if (filters.endDate) {
      query.createdAt.$lte = new Date(filters.endDate);
    }
  }

  // Get orders with customer population (search will be applied after population)
  let orders = await Order.find(query)
    .populate("customerId", "fullName email phoneNumber")
    .sort({ createdAt: -1 })
    .lean();

  // Apply search filter after population (search in orderId and customer name)
  if (filters?.search) {
    const searchLower = filters.search.toLowerCase();
    orders = orders.filter((order: any) => {
      const orderIdMatch = order.orderId?.toLowerCase().includes(searchLower);
      const customer = order.customerId;
      if (!customer) return orderIdMatch;
      
      const customerName = `${customer.fullName?.firstName || ""} ${customer.fullName?.lastName || ""}`.toLowerCase();
      const customerEmail = customer.email?.toLowerCase() || "";
      
      return (
        orderIdMatch ||
        customerName.includes(searchLower) ||
        customerEmail.includes(searchLower)
      );
    });
  }

  const total = orders.length;
  const paginatedOrders = orders.slice(skip, skip + limit);

  // Transform orders to include customer name
  const transformedOrders = paginatedOrders.map((order: any) => ({
    _id: order._id.toString(),
    orderId: order.orderId,
    customerId: order.customerId?._id?.toString() || order.customerId?.toString() || "",
    customerName: order.customerId
      ? `${order.customerId.fullName?.firstName || ""} ${order.customerId.fullName?.lastName || ""}`.trim() || "Unknown Customer"
      : "Unknown Customer",
    items: order.items,
    totalAmount: order.totalAmount,
    status: order.status,
    shippingAddress: order.shippingAddress,
    paymentMethod: order.paymentMethod,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  }));

  return {
    orders: transformedOrders,
    total,
  };
};

// Shipments
export const getDashboardShipmentsService = async (
  farmerId: string,
  filters?: DashboardShipmentsQuery
): Promise<{ shipments: any[]; total: number }> => {
  if (!farmerId) {
    throw new ApiError(400, "Farmer ID is required");
  }

  const farmerObjectId = new mongoose.Types.ObjectId(farmerId);
  const page = filters?.page || 1;
  const limit = filters?.limit || 10;
  const skip = (page - 1) * limit;

  // Build query
  const query: any = { farmerId: farmerObjectId };

  if (filters?.status) {
    query.status = filters.status;
  }

  if (filters?.startDate || filters?.endDate) {
    query.createdAt = {};
    if (filters.startDate) {
      query.createdAt.$gte = new Date(filters.startDate);
    }
    if (filters.endDate) {
      query.createdAt.$lte = new Date(filters.endDate);
    }
  }

  // Search filter
  if (filters?.search) {
    query.$or = [
      { shipmentId: { $regex: filters.search, $options: "i" } },
      { trackingNumber: { $regex: filters.search, $options: "i" } },
    ];
  }

  // Get shipments with order population
  const [shipments, total] = await Promise.all([
    Shipment.find(query)
      .populate("orderId", "orderId customerId")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Shipment.countDocuments(query),
  ]);

  // Transform shipments
  const transformedShipments = shipments.map((shipment: any) => ({
    _id: shipment._id.toString(),
    shipmentId: shipment.shipmentId,
    orderId: shipment.orderId ? shipment.orderId.orderId : shipment.orderId,
    customerName: shipment.customerName,
    customerAddress: shipment.customerAddress,
    status: shipment.status,
    expectedDeliveryDate: shipment.expectedDeliveryDate,
    actualDeliveryDate: shipment.actualDeliveryDate,
    trackingNumber: shipment.trackingNumber,
    carrier: shipment.carrier,
    createdAt: shipment.createdAt,
    updatedAt: shipment.updatedAt,
  }));

  return {
    shipments: transformedShipments,
    total,
  };
};

