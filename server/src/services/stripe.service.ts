import Stripe from "stripe";
import { ApiError } from "../utils/ApiError.js";
import Order from "../models/order.model.js";
import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";
import mongoose from "mongoose";
let stripe: Stripe | null = null;
if (process.env.STRIPE_SECRET_KEY) {
  try {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-10-29.clover",
      typescript: true,
    });
  } catch (error) {
    console.warn("Failed to initialize Stripe. Card payments will not be available.");
  }
}
export const createPaymentIntentService = async (
  userId: string,
  shippingAddress: any,
  paymentMethod: "card" | "cash"
): Promise<{ clientSecret: string; paymentIntentId: string }> => {
  if (paymentMethod === "cash") {
    const cart = await Cart.findOne({ userId: new mongoose.Types.ObjectId(userId) });
    if (!cart || cart.items.length === 0) {
      throw new ApiError(400, "Cart is empty");
    }
    // For cash payments, just validate the cart but don't create order yet
    // Order will be created in confirmPaymentService
    let totalAmount = 0;
    for (const item of cart.items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        throw new ApiError(404, `Product ${item.name} no longer exists`);
      }
      if (!product.isAvailable) {
        throw new ApiError(400, `Product ${item.name} is no longer available`);
      }
      if (product.quantity < item.quantity) {
        throw new ApiError(400, `Insufficient stock for ${item.name}. Only ${product.quantity} available`);
      }
      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;
    }
    // Generate a temporary payment intent ID for cash payments
    // The actual order will be created when payment is confirmed
    return {
      clientSecret: "cash_payment",
      paymentIntentId: `cash_${Date.now()}_${userId}`,
    };
  }
  if (!stripe || !process.env.STRIPE_SECRET_KEY) {
    throw new ApiError(400, "Card payments are not available. Please use cash on delivery or configure Stripe.");
  }
  const cart = await Cart.findOne({ userId: new mongoose.Types.ObjectId(userId) });
  if (!cart || cart.items.length === 0) {
    throw new ApiError(400, "Cart is empty");
  }
  let totalAmount = 0;
  const verifiedItems: any[] = [];
  for (const item of cart.items) {
    const product = await Product.findById(item.productId);
    if (!product) {
      throw new ApiError(404, `Product ${item.name} no longer exists`);
    }
    if (!product.isAvailable) {
      throw new ApiError(400, `Product ${item.name} is no longer available`);
    }
    if (product.quantity < item.quantity) {
      throw new ApiError(400, `Insufficient stock for ${item.name}. Only ${product.quantity} available`);
    }
    const itemTotal = product.price * item.quantity;
    totalAmount += itemTotal;
    verifiedItems.push({
      productId: product._id.toString(),
      productName: product.name,
      quantity: item.quantity,
      unit: product.unit,
      price: product.price,
      total: itemTotal,
    });
  }
  // Convert PKR to USD for Stripe (approximate rate: 1 USD = 280 PKR)
  // This is a simplified conversion - in production, use real-time exchange rates
  const PKR_TO_USD_RATE = 280;
  const amountInUSD = totalAmount / PKR_TO_USD_RATE;
  const amountInCents = Math.round(amountInUSD * 100);
  
  // Stripe minimum is $0.50 USD
  if (amountInCents < 50) {
    throw new ApiError(400, `Order total must be at least Rs. ${Math.ceil(50 * PKR_TO_USD_RATE / 100)}`);
  }
  
  if (!stripe) {
    throw new ApiError(500, "Stripe is not configured");
  }
  
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "usd", // Stripe doesn't support PKR directly, converting PKR to USD
      metadata: {
        userId: userId,
        orderType: "cart",
        originalAmountPKR: totalAmount.toString(), // Store original PKR amount
        conversionRate: PKR_TO_USD_RATE.toString(),
      },
      automatic_payment_methods: {
        enabled: true,
      },
      description: `Order payment - Rs. ${totalAmount.toFixed(2)} PKR`,
    });
    return {
      clientSecret: paymentIntent.client_secret || "",
      paymentIntentId: paymentIntent.id,
    };
  } catch (error: any) {
    console.error("Stripe Payment Intent creation error:", error);
    if (error.type === "StripeInvalidRequestError") {
      throw new ApiError(400, `Payment error: ${error.message}`);
    }
    throw new ApiError(500, `Payment processing error: ${error.message}`);
  }
};
export const confirmPaymentService = async (
  userId: string,
  paymentIntentId: string,
  shippingAddress: any
): Promise<any> => {
  const cart = await Cart.findOne({ userId: new mongoose.Types.ObjectId(userId) });
  if (!cart || cart.items.length === 0) {
    throw new ApiError(400, "Cart is empty");
  }
  // Check if this is a cash payment (paymentIntentId starts with "cash_")
  const isCashPayment = paymentIntentId.startsWith("cash_") || paymentIntentId === "cash_payment";
  if (!isCashPayment) {
    if (!stripe) {
      throw new ApiError(500, "Stripe is not configured");
    }
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      if (paymentIntent.status !== "succeeded") {
        throw new ApiError(400, "Payment not completed");
      }
      if (paymentIntent.metadata.userId !== userId) {
        throw new ApiError(403, "Payment intent does not belong to this user");
      }
    } catch (error: any) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, `Payment verification failed: ${error.message}`);
    }
  }
  const verifiedItems: any[] = [];
  let totalAmount = 0;
  let farmerId: mongoose.Types.ObjectId | null = null;
  
  for (const item of cart.items) {
    const product = await Product.findById(item.productId);
    if (!product) {
      throw new ApiError(404, `Product ${item.name} no longer exists`);
    }
    if (!product.isAvailable) {
      throw new ApiError(400, `Product ${item.name} is no longer available`);
    }
    if (product.quantity < item.quantity) {
      throw new ApiError(400, `Insufficient stock for ${item.name}`);
    }
    
    // Get farmerId from the first product (assuming all products are from the same farmer)
    if (!farmerId && product.farmerId) {
      farmerId = new mongoose.Types.ObjectId(product.farmerId.toString());
    }
    
    // Validate that all products are from the same farmer
    if (farmerId && product.farmerId && product.farmerId.toString() !== farmerId.toString()) {
      throw new ApiError(400, "All products in cart must be from the same farmer");
    }
    
    const itemTotal = product.price * item.quantity;
    totalAmount += itemTotal;
    verifiedItems.push({
      productId: product._id.toString(),
      productName: product.name,
      quantity: item.quantity,
      unit: product.unit,
      price: product.price,
      total: itemTotal,
    });
  }
  
  if (!farmerId) {
    throw new ApiError(400, "Unable to determine farmer for order. Products may not have a farmer assigned.");
  }
  
  const order = new Order({
    orderId: `TEMP-${Date.now()}`,
    customerId: new mongoose.Types.ObjectId(userId),
    items: verifiedItems.map(item => ({
      ...item,
      productId: new mongoose.Types.ObjectId(item.productId),
    })),
    totalAmount,
    status: isCashPayment ? "pending" : "confirmed",
    shippingAddress,
    paymentMethod: isCashPayment ? "cash" : "card",
    farmerId: farmerId,
  });
  await order.save();
  for (const item of verifiedItems) {
    await Product.findByIdAndUpdate(item.productId, {
      $inc: { quantity: -item.quantity },
    });
    const updatedProduct = await Product.findById(item.productId);
    if (updatedProduct && updatedProduct.quantity === 0) {
      updatedProduct.isAvailable = false;
      await updatedProduct.save();
    }
  }
  cart.items = [];
  await cart.save();
  return order;
};
export const handleStripeWebhook = async (event: Stripe.Event): Promise<void> => {
  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log(`Payment succeeded: ${paymentIntent.id}`);
      break;
    case "payment_intent.payment_failed":
      const failedPayment = event.data.object as Stripe.PaymentIntent;
      console.log(`Payment failed: ${failedPayment.id}`);
      break;
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }
};
export default stripe;
