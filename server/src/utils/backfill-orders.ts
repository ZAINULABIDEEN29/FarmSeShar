import "../config/env.config.js";
import mongoose from "mongoose";
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import connectDB from "../db/db.js";

export const backfillOrderFarmerIds = async (): Promise<void> => {
  try {
    await connectDB();
    console.log("Connected to database");

    const ordersWithoutFarmerId = await Order.find({
      $or: [
        { farmerId: { $exists: false } },
        { farmerId: null },
      ],
    }).lean();


    let updatedCount = 0;
    let errorCount = 0;

    for (const order of ordersWithoutFarmerId) {
      try {
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
    process.exit(0);
  } catch (error: any) {
    console.error("Backfill failed:", error);
    process.exit(1);
  }
};

if (process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/'))) {
  backfillOrderFarmerIds();
}

