import React, { useState, useCallback } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import FormField from "@/components/auth/FormField";
import TextAreaField from "@/components/auth/TextAreaField";
import { Button } from "@/components/ui/button";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { uploadService } from "@/services/upload.service";
import { toast } from "react-toastify";
import type { CreateProductInput, UpdateProductInput } from "@/types/product.types";

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
  images: Yup.array()
    .of(Yup.string().url("Must be a valid URL"))
    .min(1, "At least one product image is required")
    .required("Product images are required"),
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
  "Dairy",
  "Herbs",
];

const units = ["kg", "g", "lb", "piece", "box", "bunch", "dozen", "liter", "ml"];

const ProductForm: React.FC<ProductFormProps> = ({
  initialValues = {},
  onSubmit,
  onCancel,
  isLoading = false,
  submitLabel = "Save Product",
}) => {
  const [uploadingImages, setUploadingImages] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<string[]>(
    initialValues.images || []
  );

  const formik = useFormik({
    initialValues: {
      name: initialValues.name || "",
      description: initialValues.description || "",
      price: initialValues.price || 0,
      category: initialValues.category || "",
      quantity: initialValues.quantity || 0,
      unit: initialValues.unit || "kg",
      images: initialValues.images || [],
      isAvailable: initialValues.isAvailable ?? true,
    },
    validationSchema,
    onSubmit: (values) => {
      const { isAvailable, ...productData } = values;
      onSubmit(productData);
    },
  });

  const handleImageSelect = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (!files || files.length === 0) return;

      const validFiles = Array.from(files).filter((file) => {
        if (!file.type.startsWith("image/")) {
          toast.error(`${file.name} is not an image file`);
          return false;
        }
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`${file.name} is too large. Maximum size is 5MB`);
          return false;
        }
        return true;
      });

      if (validFiles.length === 0) return;

      setUploadingImages(true);
      try {
        const uploadPromises = validFiles.map((file) => uploadService.uploadImage(file));
        const results = await Promise.all(uploadPromises);
        const newImageUrls = results.map((result) => result.image.url);
        const updatedImages = [...imagePreviews, ...newImageUrls];
        
        setImagePreviews(updatedImages);
        formik.setFieldValue("images", updatedImages);
        toast.success(`${validFiles.length} image(s) uploaded successfully`);
      } catch (error: any) {
        console.error("Image upload error:", error);
        toast.error(error.response?.data?.message || "Failed to upload images");
      } finally {
        setUploadingImages(false);
        // Reset input
        event.target.value = "";
      }
    },
    [imagePreviews, formik]
  );

  const handleRemoveImage = useCallback(
    (index: number) => {
      const updatedImages = imagePreviews.filter((_, i) => i !== index);
      setImagePreviews(updatedImages);
      formik.setFieldValue("images", updatedImages);
    },
    [imagePreviews, formik]
  );

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

        {/* Product Images */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Images <span className="text-red-500">*</span>
          </label>
          
          {/* Image Upload Area */}
          <div className="mb-4">
            <label
              htmlFor="image-upload"
              className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                uploadingImages
                  ? "border-gray-300 bg-gray-50"
                  : "border-gray-300 hover:border-green-500 hover:bg-green-50"
              }`}
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                {uploadingImages ? (
                  <>
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mb-2"></div>
                    <p className="text-sm text-gray-600">Uploading images...</p>
                  </>
                ) : (
                  <>
                    <Upload className="w-10 h-10 mb-3 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB (Max 10 images)</p>
                  </>
                )}
              </div>
              <input
                id="image-upload"
                type="file"
                className="hidden"
                accept="image/*"
                multiple
                onChange={handleImageSelect}
                disabled={uploadingImages || imagePreviews.length >= 10}
              />
            </label>
          </div>

          {/* Image Previews */}
          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {imagePreviews.map((imageUrl, index) => (
                <div
                  key={index}
                  className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200"
                >
                  <img
                    src={imageUrl}
                    alt={`Product image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    aria-label="Remove image"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 text-center">
                    Image {index + 1}
                  </div>
                </div>
              ))}
            </div>
          )}

          {formik.touched.images && formik.errors.images && (
            <p className="text-sm text-red-600 mt-1">
              {typeof formik.errors.images === "string"
                ? formik.errors.images
                : "At least one product image is required"}
            </p>
          )}

          {imagePreviews.length === 0 && !uploadingImages && (
            <div className="flex items-center gap-2 text-sm text-amber-600 mt-2">
              <ImageIcon className="w-4 h-4" />
              <span>Please upload at least one product image</span>
            </div>
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
            disabled={isLoading || uploadingImages}
            className="flex-1"
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          disabled={isLoading || uploadingImages || imagePreviews.length === 0}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;
