import React, { useState, useMemo, useCallback, useEffect } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductList from "@/components/products/ProductList";
import ProductForm from "@/components/products/ProductForm";
import type { Product, CreateProductInput, UpdateProductInput } from "@/types/product.types";
import {
  useGetMyProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
  useToggleProductAvailability,
} from "@/hooks/useProducts";
import { cn } from "@/lib/utils";
const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
};
interface ProductsSectionProps {
  className?: string;
}
const ProductsSection: React.FC<ProductsSectionProps> = ({ className }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const { data: products = [], isLoading } = useGetMyProducts({
    search: debouncedSearchQuery || undefined,
    category: selectedCategory || undefined,
  });
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();
  const toggleMutation = useToggleProductAvailability();
  const handleSubmit = useCallback(
    (values: CreateProductInput | UpdateProductInput) => {
      if (editingProduct) {
        updateMutation.mutate(
          { productId: editingProduct._id, data: values },
          {
            onSuccess: () => {
              setShowForm(false);
              setEditingProduct(null);
            },
          }
        );
      } else {
        createMutation.mutate(values as CreateProductInput, {
          onSuccess: () => {
            setShowForm(false);
          },
        });
      }
    },
    [editingProduct, updateMutation, createMutation]
  );
  const handleEdit = useCallback((product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  }, []);
  const handleDelete = useCallback(
    (productId: string) => {
      if (window.confirm("Are you sure you want to delete this product?")) {
        deleteMutation.mutate(productId);
      }
    },
    [deleteMutation]
  );
  const handleCancel = useCallback(() => {
    setShowForm(false);
    setEditingProduct(null);
  }, []);
  const handleToggleAvailability = useCallback(
    (productId: string) => {
      toggleMutation.mutate(productId);
    },
    [toggleMutation]
  );
  const categories = useMemo(
    () => [
      "Vegetables",
      "Fruits",
      "Dairy",
      "Herbs",
    ],
    []
  );
  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Products</h2>
          <p className="text-gray-600 mt-1">Manage your product inventory</p>
        </div>
      </div>
      {!showForm ? (
        <>
          {}
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <Button
                onClick={() => setShowForm(true)}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Product
              </Button>
            </div>
          </div>
          {}
          <ProductList
            products={products}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleAvailability={handleToggleAvailability}
            isLoading={isLoading}
          />
        </>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {editingProduct ? "Edit Product" : "Add New Product"}
          </h2>
          <ProductForm
            initialValues={editingProduct || undefined}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={createMutation.isPending || updateMutation.isPending}
            submitLabel={editingProduct ? "Update Product" : "Create Product"}
          />
        </div>
      )}
    </div>
  );
};
export default ProductsSection;
