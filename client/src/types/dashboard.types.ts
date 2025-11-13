// Customer Types
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
  lastOrderDate?: string;
  createdAt?: string;
}

// Order Types
export type OrderStatus = "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";

export interface Order {
  _id: string;
  orderId: string; // Display ID for customer
  customerId: string;
  customerName: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  shippingAddress: {
    streetAddress: string;
    houseNo: string;
    town: string;
    city: string;
    country: string;
    postalCode: string;
  };
  paymentMethod: "card" | "cash";
  createdAt: string;
  updatedAt?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unit: string;
  price: number;
  total: number;
}

// Shipment Types
export type ShipmentStatus = "pending" | "preparing" | "in_transit" | "out_for_delivery" | "delivered" | "cancelled";

export interface Shipment {
  _id: string;
  shipmentId: string; // Tracking ID
  orderId: string;
  customerName: string;
  customerAddress: {
    streetAddress: string;
    houseNo: string;
    town: string;
    city: string;
    country: string;
    postalCode: string;
  };
  status: ShipmentStatus;
  expectedDeliveryDate: string;
  actualDeliveryDate?: string;
  trackingNumber?: string;
  carrier?: string;
  createdAt: string;
  updatedAt?: string;
}

