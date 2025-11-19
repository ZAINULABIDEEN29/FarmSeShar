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
  const [totalProducts, availableProducts] = await Promise.all([
    Product.countDocuments({ farmerId: farmerObjectId }),
    Product.countDocuments({ 
      farmerId: farmerObjectId, 
      isAvailable: true 
    }),
  ]);
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
  const orderQuery: any = { farmerId: farmerObjectId };
  const orders = await Order.find(orderQuery).lean();
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
  const customerIds = Array.from(customerMap.keys()).map(
    (id) => new mongoose.Types.ObjectId(id)
  );
  let users = await User.find({ _id: { $in: customerIds } })
    .select("fullName email phoneNumber createdAt")
    .lean();
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
  let orders = await Order.find(query)
    .populate("customerId", "fullName email phoneNumber")
    .sort({ createdAt: -1 })
    .lean();
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
  const transformedOrders = paginatedOrders.map((order: any) => ({
    _id: order._id.toString(),
    orderId: order.orderId,
    customerId: order.customerId?._id?.toString() || order.customerId?.toString() || "",
    customerName: order.customerId
      ? `${order.customerId.fullName?.firstName || ""} ${order.customerId.fullName?.lastName || ""}`.trim() || "Unknown Customer"
      : "Unknown Customer",
    items: order.items.map((item: any) => ({
      productId: item.productId?.toString() || item.productId || "",
      productName: item.productName,
      quantity: item.quantity,
      unit: item.unit,
      price: item.price,
      total: item.total,
    })),
    totalAmount: order.totalAmount,
    status: order.status,
    shippingAddress: order.shippingAddress,
    paymentMethod: order.paymentMethod,
    createdAt: order.createdAt ? new Date(order.createdAt).toISOString() : new Date().toISOString(),
    updatedAt: order.updatedAt ? new Date(order.updatedAt).toISOString() : undefined,
  }));
  return {
    orders: transformedOrders,
    total,
  };
};
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
  if (filters?.search) {
    query.$or = [
      { shipmentId: { $regex: filters.search, $options: "i" } },
      { trackingNumber: { $regex: filters.search, $options: "i" } },
    ];
  }
  const [shipments, total] = await Promise.all([
    Shipment.find(query)
      .populate("orderId", "orderId")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Shipment.countDocuments(query),
  ]);
  
  const transformedShipments = shipments.map((shipment: any) => {
    let orderIdValue: string = "";
    
    // Handle orderId - it might be populated or just an ObjectId
    if (shipment.orderId) {
      if (typeof shipment.orderId === 'object' && shipment.orderId !== null) {
        // Populated orderId object
        orderIdValue = shipment.orderId.orderId || shipment.orderId._id?.toString() || "";
      } else if (typeof shipment.orderId === 'string') {
        // Just ObjectId string - we'll need to fetch the order
        orderIdValue = shipment.orderId;
      }
    }
    
    return {
      _id: shipment._id.toString(),
      shipmentId: shipment.shipmentId || "",
      orderId: orderIdValue,
      customerName: shipment.customerName || "Unknown Customer",
      customerAddress: shipment.customerAddress || {
        streetAddress: "",
        houseNo: "",
        town: "",
        city: "",
        country: "",
        postalCode: "",
      },
      status: shipment.status || "pending",
      expectedDeliveryDate: shipment.expectedDeliveryDate 
        ? new Date(shipment.expectedDeliveryDate).toISOString() 
        : new Date().toISOString(),
      actualDeliveryDate: shipment.actualDeliveryDate 
        ? new Date(shipment.actualDeliveryDate).toISOString() 
        : undefined,
      trackingNumber: shipment.trackingNumber || undefined,
      carrier: shipment.carrier || undefined,
      createdAt: shipment.createdAt 
        ? new Date(shipment.createdAt).toISOString() 
        : new Date().toISOString(),
      updatedAt: shipment.updatedAt 
        ? new Date(shipment.updatedAt).toISOString() 
        : undefined,
    };
  });
  
  // If we have shipments with string orderIds, fetch the actual orderIds
  const shipmentsWithStringOrderIds = transformedShipments.filter(s => s.orderId && !s.orderId.startsWith("ORD-"));
  if (shipmentsWithStringOrderIds.length > 0) {
    const orderObjectIds = shipmentsWithStringOrderIds
      .map(s => {
        try {
          return new mongoose.Types.ObjectId(s.orderId);
        } catch {
          return null;
        }
      })
      .filter((id): id is mongoose.Types.ObjectId => id !== null);
    
    if (orderObjectIds.length > 0) {
      const orders = await Order.find({ _id: { $in: orderObjectIds } }).select("orderId").lean();
      const orderMap = new Map(orders.map((o: any) => [o._id.toString(), o.orderId]));
      
      transformedShipments.forEach((shipment) => {
        if (shipment.orderId && !shipment.orderId.startsWith("ORD-")) {
          const mappedOrderId = orderMap.get(shipment.orderId);
          if (mappedOrderId) {
            shipment.orderId = mappedOrderId;
          }
        }
      });
    }
  }
  return {
    shipments: transformedShipments,
    total,
  };
};
