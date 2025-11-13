import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import FormField from "@/components/auth/FormField";
import TextAreaField from "@/components/auth/TextAreaField";
import { Button } from "@/components/ui/button";
import type { Product, CreateProductInput, UpdateProductInput } from "@/types/product.types";

const validationSchema = Yup.object({
  name: Yup.string()
    .min(2, "Product name must be at least 2 characters")
    .max(100, "Product name must be less than 100 characters")
    .required("Product name is required"),
  description: Yup.string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be less than 500 characters")
    .required("Description is required"),
  price: Yup.number()
    .positive("Price must be positive")
    .required("Price is required"),
  category: Yup.string().required("Category is required"),
  quantity: Yup.number()
    .integer("Quantity must be a whole number")
    .min(0, "Quantity cannot be negative")
    .required("Quantity is required"),
  unit: Yup.string().required("Unit is required"),
  image: Yup.string().url("Must be a valid URL").optional(),
});

interface ProductFormProps {
  initialValues?: Partial<CreateProductInput & { isAvailable?: boolean }>;
  onSubmit: (values: CreateProductInput | UpdateProductInput) => void;
  onCancel?: () => void;
  isLoading?: boolean;
  submitLabel?: string;
}

const categories = [
  "Vegetables",
  "Fruits",
  "Grains",
  "Dairy",
  "Meat",
  "Poultry",
  "Herbs",
  "Spices",
  "Other",
];

const units = ["kg", "g", "lb", "piece", "box", "bunch", "dozen", "liter", "ml"];

const ProductForm: React.FC<ProductFormProps> = ({
  initialValues = {},
  onSubmit,
  onCancel,
  isLoading = false,
  submitLabel = "Save Product",
}) => {
  const formik = useFormik({
    initialValues: {
      name: initialValues.name || "",
      description: initialValues.description || "",
      price: initialValues.price || 0,
      category: initialValues.category || "",
      quantity: initialValues.quantity || 0,
      unit: initialValues.unit || "kg",
      image: initialValues.image || "",
      isAvailable: initialValues.isAvailable ?? true,
    },
    validationSchema,
    onSubmit: (values) => {
      const { isAvailable, ...productData } = values;
      onSubmit(productData);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Product Name */}
        <div className="md:col-span-2">
          <FormField
            label="Product Name"
            id="name"
            type="text"
            placeholder="e.g., Organic Tomatoes"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
          />
          {formik.touched.name && formik.errors.name && (
            <p className="text-sm text-red-600 mt-1">{formik.errors.name}</p>
          )}
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <TextAreaField
            label="Description"
            id="description"
            placeholder="Describe your product..."
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
            rows={4}
          />
          {formik.touched.description && formik.errors.description && (
            <p className="text-sm text-red-600 mt-1">{formik.errors.description}</p>
          )}
        </div>

        {/* Price */}
        <div>
          <FormField
            label="Price"
            id="price"
            type="number"
            placeholder="0.00"
            value={formik.values.price.toString()}
            onChange={(e) => formik.setFieldValue("price", parseFloat(e.target.value) || 0)}
            onBlur={formik.handleBlur}
            required
          />
          {formik.touched.price && formik.errors.price && (
            <p className="text-sm text-red-600 mt-1">{formik.errors.price}</p>
          )}
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            id="category"
            value={formik.values.category}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full h-12 px-4 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            required
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {formik.touched.category && formik.errors.category && (
            <p className="text-sm text-red-600 mt-1">{formik.errors.category}</p>
          )}
        </div>

        {/* Quantity */}
        <div>
          <FormField
            label="Quantity"
            id="quantity"
            type="number"
            placeholder="0"
            value={formik.values.quantity.toString()}
            onChange={(e) => formik.setFieldValue("quantity", parseInt(e.target.value) || 0)}
            onBlur={formik.handleBlur}
            required
          />
          {formik.touched.quantity && formik.errors.quantity && (
            <p className="text-sm text-red-600 mt-1">{formik.errors.quantity}</p>
          )}
        </div>

        {/* Unit */}
        <div>
          <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-2">
            Unit <span className="text-red-500">*</span>
          </label>
          <select
            id="unit"
            value={formik.values.unit}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full h-12 px-4 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            required
          >
            {units.map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>
          {formik.touched.unit && formik.errors.unit && (
            <p className="text-sm text-red-600 mt-1">{formik.errors.unit}</p>
          )}
        </div>

        {/* Image URL */}
        <div className="md:col-span-2">
          <FormField
            label="Image URL (Optional)"
            id="image"
            type="url"
            placeholder="https://example.com/image.jpg"
            value={formik.values.image}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.image && formik.errors.image && (
            <p className="text-sm text-red-600 mt-1">{formik.errors.image}</p>
          )}
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex gap-4 pt-4">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1"
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;

