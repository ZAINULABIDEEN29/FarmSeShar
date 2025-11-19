import { z } from "zod";
export const orderItemSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  productName: z.string().min(1, "Product name is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  unit: z.string().min(1, "Unit is required"),
  price: z.number().min(0, "Price cannot be negative"),
  total: z.number().min(0, "Total cannot be negative"),
});
export const shippingAddressSchema = z.object({
  streetAddress: z.string().min(1, "Street address is required"),
  houseNo: z.string().min(1, "House number is required"),
  town: z.string().min(1, "Town is required"),
  city: z.string().min(1, "City is required"),
  country: z.string().min(1, "Country is required"),
  postalCode: z.string().min(1, "Postal code is required"),
});
export const createOrderSchema = z.object({
  items: z.array(orderItemSchema).min(1, "Order must have at least one item"),
  shippingAddress: shippingAddressSchema,
  paymentMethod: z.enum(["card", "cash"], {
    errorMap: () => ({ message: "Payment method must be either 'card' or 'cash'" }),
  }),
});
export const updateOrderStatusSchema = z.object({
  status: z.enum(["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"], {
    errorMap: () => ({ message: "Invalid order status" }),
  }),
});
export const createShipmentSchema = z.object({
  orderId: z.string().min(1, "Order ID is required"),
  expectedDeliveryDate: z.string().min(1, "Expected delivery date is required"),
  trackingNumber: z.string().optional(),
  carrier: z.string().optional(),
});
export const updateShipmentStatusSchema = z.object({
  status: z.enum(["pending", "preparing", "in_transit", "out_for_delivery", "delivered", "cancelled"], {
    errorMap: () => ({ message: "Invalid shipment status" }),
  }),
  trackingNumber: z.string().optional(),
  carrier: z.string().optional(),
});
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
export type CreateShipmentInput = z.infer<typeof createShipmentSchema>;
export type UpdateShipmentStatusInput = z.infer<typeof updateShipmentStatusSchema>;
