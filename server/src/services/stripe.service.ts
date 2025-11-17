import Stripe from "stripe";
import { ApiError } from "../utils/ApiError.js";
import Order from "../models/order.model.js";
import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";
import mongoose from "mongoose";

// Initialize Stripe only if secret key is provided
// This allows the app to work with cash payments even without Stripe configured
let stripe: Stripe | null = null;

if (process.env.STRIPE_SECRET_KEY) {
  try {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-10-29.clover", // Use latest stable API version
      typescript: true,
    });
  } catch (error) {
    console.warn("Failed to initialize Stripe. Card payments will not be available.");
  }
}

/**
 * Create a Payment Intent for a cart
 * This is the secure way to handle payments - the amount is calculated server-side
 */
export const createPaymentIntentService = async (
  userId: string,
  shippingAddress: any,
  paymentMethod: "card" | "cash"
): Promise<{ clientSecret: string; paymentIntentId: string }> => {
  // For cash payments, Stripe is not needed
  if (paymentMethod === "cash") {
    // Get user's cart
    const cart = await Cart.findOne({ userId: new mongoose.Types.ObjectId(userId) })
      .populate("items.productId");

    if (!cart || cart.items.length === 0) {
      throw new ApiError(400, "Cart is empty");
    }

    // Verify all products are still available and calculate total
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

    // Create order directly for cash payments
    const order = new Order({
      orderId: `TEMP-${Date.now()}`,
      customerId: new mongoose.Types.ObjectId(userId),
      items: verifiedItems.map(item => ({
        ...item,
        productId: new mongoose.Types.ObjectId(item.productId),
      })),
      totalAmount,
      status: "pending",
      shippingAddress,
      paymentMethod: "cash",
    });

    await order.save();

    // Clear cart after order creation
    cart.items = [];
    await cart.save();

    // Update product quantities
    for (const item of verifiedItems) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { quantity: -item.quantity },
      });
    }

    return {
      clientSecret: "cash_payment",
      paymentIntentId: order._id.toString(),
    };
  }

  // For card payments, Stripe is required
  if (!stripe || !process.env.STRIPE_SECRET_KEY) {
    throw new ApiError(400, "Card payments are not available. Please use cash on delivery or configure Stripe.");
  }

  // Get user's cart
  const cart = await Cart.findOne({ userId: new mongoose.Types.ObjectId(userId) })
    .populate("items.productId");

  if (!cart || cart.items.length === 0) {
    throw new ApiError(400, "Cart is empty");
  }

  // Verify all products are still available and calculate total
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

  // Convert to cents (Stripe uses smallest currency unit)
  const amountInCents = Math.round(totalAmount * 100);

  if (amountInCents < 50) { // Minimum $0.50
    throw new ApiError(400, "Order total must be at least Rs. 0.50");
  }

  // Create Stripe Payment Intent for card payments
  if (!stripe) {
    throw new ApiError(500, "Stripe is not configured");
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "pkr", // Pakistani Rupee
      metadata: {
        userId: userId,
        orderType: "cart",
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return {
      clientSecret: paymentIntent.client_secret || "",
      paymentIntentId: paymentIntent.id,
    };
  } catch (error: any) {
    console.error("Stripe Payment Intent creation error:", error);
    throw new ApiError(500, `Payment processing error: ${error.message}`);
  }
};

/**
 * Confirm payment and create order
 * This should be called after successful payment on the client
 */
export const confirmPaymentService = async (
  userId: string,
  paymentIntentId: string,
  shippingAddress: any
): Promise<any> => {
  // Get user's cart
  const cart = await Cart.findOne({ userId: new mongoose.Types.ObjectId(userId) })
    .populate("items.productId");

  if (!cart || cart.items.length === 0) {
    throw new ApiError(400, "Cart is empty");
  }

  // Verify payment with Stripe (only for card payments)
  if (paymentIntentId !== "cash_payment") {
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

  // Verify all products are still available
  const verifiedItems: any[] = [];
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
      throw new ApiError(400, `Insufficient stock for ${item.name}`);
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

  // Create order
  const order = new Order({
    orderId: `TEMP-${Date.now()}`,
    customerId: new mongoose.Types.ObjectId(userId),
    items: verifiedItems.map(item => ({
      ...item,
      productId: new mongoose.Types.ObjectId(item.productId),
    })),
    totalAmount,
    status: paymentIntentId === "cash_payment" ? "pending" : "confirmed",
    shippingAddress,
    paymentMethod: paymentIntentId === "cash_payment" ? "cash" : "card",
  });

  await order.save();

  // Update product quantities
  for (const item of verifiedItems) {
    await Product.findByIdAndUpdate(item.productId, {
      $inc: { quantity: -item.quantity },
    });

    // Mark as unavailable if quantity reaches 0
    const updatedProduct = await Product.findById(item.productId);
    if (updatedProduct && updatedProduct.quantity === 0) {
      updatedProduct.isAvailable = false;
      await updatedProduct.save();
    }
  }

  // Clear cart
  cart.items = [];
  await cart.save();

  return order;
};

/**
 * Handle Stripe webhook events
 * This is called by Stripe when payment events occur
 */
export const handleStripeWebhook = async (event: Stripe.Event): Promise<void> => {
  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log(`Payment succeeded: ${paymentIntent.id}`);
      // You can update order status here if needed
      break;

    case "payment_intent.payment_failed":
      const failedPayment = event.data.object as Stripe.PaymentIntent;
      console.log(`Payment failed: ${failedPayment.id}`);
      // Handle failed payment
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }
};

export default stripe;

