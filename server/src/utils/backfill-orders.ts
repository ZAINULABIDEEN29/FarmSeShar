import "../config/env.config.js";
import mongoose from "mongoose";
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import connectDB from "../db/db.js";

/**
 * Backfill script to add farmerId to existing orders that don't have it.
 * This script finds orders without farmerId and sets it based on the products in the order.
 * 
 * Usage: Run this script once to fix existing orders in the database.
 * 
 * Note: This assumes all products in an order belong to the same farmer.
 * If an order has products from multiple farmers, it will use the farmerId from the first product.
 */
export const backfillOrderFarmerIds = async (): Promise<void> => {
  try {
    await connectDB();
    console.log("Connected to database");

    // Find all orders without farmerId
    const ordersWithoutFarmerId = await Order.find({
      $or: [
        { farmerId: { $exists: false } },
        { farmerId: null },
      ],
    }).lean();

    console.log(`Found ${ordersWithoutFarmerId.length} orders without farmerId`);

    let updatedCount = 0;
    let errorCount = 0;

    for (const order of ordersWithoutFarmerId) {
      try {
        // Get the first product from the order to determine farmerId
        if (!order.items || order.items.length === 0) {
          console.warn(`Order ${order.orderId} has no items, skipping`);
          continue;
        }

        const firstProductId = order.items[0].productId;
        const product = await Product.findById(firstProductId).lean();

        if (!product) {
          console.warn(`Product ${firstProductId} not found for order ${order.orderId}, skipping`);
          errorCount++;
          continue;
        }

        if (!product.farmerId) {
          console.warn(`Product ${firstProductId} has no farmerId for order ${order.orderId}, skipping`);
          errorCount++;
          continue;
        }

        // Validate that all products in the order belong to the same farmer
        const productIds = order.items.map((item: any) => item.productId);
        const products = await Product.find({ _id: { $in: productIds } }).lean();
        
        const farmerIds = new Set(
          products
            .map((p: any) => p.farmerId?.toString())
            .filter((id: string | undefined) => id !== undefined)
        );

        if (farmerIds.size === 0) {
          console.warn(`No valid farmerId found for products in order ${order.orderId}, skipping`);
          errorCount++;
          continue;
        }

        if (farmerIds.size > 1) {
          console.warn(
            `Order ${order.orderId} has products from multiple farmers: ${Array.from(farmerIds).join(", ")}. Using first farmer.`
          );
        }

        // Update the order with farmerId
        const farmerId = new mongoose.Types.ObjectId(product.farmerId.toString());
        await Order.updateOne(
          { _id: order._id },
          { $set: { farmerId } }
        );

        updatedCount++;
        console.log(`Updated order ${order.orderId} with farmerId ${farmerId}`);
      } catch (error: any) {
        console.error(`Error processing order ${order.orderId}:`, error.message);
        errorCount++;
      }
    }

    console.log("\n=== Backfill Summary ===");
    console.log(`Total orders processed: ${ordersWithoutFarmerId.length}`);
    console.log(`Successfully updated: ${updatedCount}`);
    console.log(`Errors/Skipped: ${errorCount}`);
    console.log("Backfill completed!");

    process.exit(0);
  } catch (error: any) {
    console.error("Backfill failed:", error);
    process.exit(1);
  }
};

// Run the backfill if this script is executed directly
// Note: This check may not work in all environments, so you can also call backfillOrderFarmerIds() directly
if (process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/'))) {
  backfillOrderFarmerIds();
}

