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
  const PKR_TO_USD_RATE = 280;
  const amountInUSD = totalAmount / PKR_TO_USD_RATE;
  const amountInCents = Math.round(amountInUSD * 100);
  if (amountInCents < 50) {
    throw new ApiError(400, `Order total must be at least Rs. ${Math.ceil(50 * PKR_TO_USD_RATE / 100)}`);
  }
  
  if (!stripe) {
    throw new ApiError(500, "Stripe is not configured");
  }
  
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "usd",
      metadata: {
        userId: userId,
        orderType: "cart",
        originalAmountPKR: totalAmount.toString(),
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
    
    if (!farmerId && product.farmerId) {
      farmerId = new mongoose.Types.ObjectId(product.farmerId.toString());
    }
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
      break;
    case "payment_intent.payment_failed":
      break;
    default:
      break;
  }
};


export default stripe;
