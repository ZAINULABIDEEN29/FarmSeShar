import { z } from "zod";

export const createProductSchema = z.object({
  name: z
    .string()
    .min(2, "Product name must be at least 2 characters")
    .max(100, "Product name must be at most 100 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be at most 500 characters"),
  price: z.number().positive("Price must be positive"),
  category: z.enum([
    "Vegetables",
    "Fruits",
    "Grains",
    "Dairy",
    "Meat",
    "Poultry",
    "Herbs",
    "Spices",
    "Other",
  ]),
  quantity: z.number().int("Quantity must be a whole number").min(0, "Quantity cannot be negative"),
  unit: z.enum(["kg", "g", "lb", "piece", "box", "bunch", "dozen", "liter", "ml"]),
  image: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  images: z.array(z.string().url("Must be a valid URL")).optional(),
});

export const updateProductSchema = createProductSchema.partial().extend({
  isAvailable: z.boolean().optional(),
});

export const productQuerySchema = z.object({
  category: z
    .enum([
      "Vegetables",
      "Fruits",
      "Grains",
      "Dairy",
      "Meat",
      "Poultry",
      "Herbs",
      "Spices",
      "Other",
    ])
    .optional(),
  minPrice: z.coerce.number().positive().optional(),
  maxPrice: z.coerce.number().positive().optional(),
  isAvailable: z.coerce.boolean().optional(),
  search: z.string().optional(),
}).passthrough(); // Allow additional query parameters

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ProductQueryInput = z.infer<typeof productQuerySchema>;

