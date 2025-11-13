import React, { useState, useMemo, useCallback, useEffect } from "react";
import { Plus, Search, LogOut, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductList from "@/components/products/ProductList";
import ProductForm from "@/components/products/ProductForm";
import {
  useGetMyProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
  useToggleProductAvailability,
} from "@/hooks/useProducts";
import { useLogoutFarmer } from "@/hooks/useAuth";
import { useAppSelector } from "@/store/hooks";
import type { Product, CreateProductInput, UpdateProductInput } from "@/types/product.types";

// Debounce hook
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

const FarmerDashboard: React.FC = () => {
  const farmer = useAppSelector((state) => state.auth.farmer);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  // Debounce search query to avoid excessive API calls
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const { data: products = [], isLoading } = useGetMyProducts({
    search: debouncedSearchQuery || undefined,
    category: selectedCategory || undefined,
  });

  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();
  const toggleMutation = useToggleProductAvailability();
  const logoutMutation = useLogoutFarmer();

  const handleSubmit = useCallback((values: CreateProductInput | UpdateProductInput) => {
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
  }, [editingProduct, updateMutation, createMutation]);

  const handleEdit = useCallback((product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  }, []);

  const handleDelete = useCallback((productId: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      deleteMutation.mutate(productId);
    }
  }, [deleteMutation]);

  const handleCancel = useCallback(() => {
    setShowForm(false);
    setEditingProduct(null);
  }, []);

  const handleLogout = useCallback(() => {
    logoutMutation.mutate();
  }, [logoutMutation]);

  const handleToggleAvailability = useCallback((productId: string) => {
    toggleMutation.mutate(productId);
  }, [toggleMutation]);

  // Memoize categories array
  const categories = useMemo(() => 
    ["Vegetables", "Fruits", "Grains", "Dairy", "Meat", "Poultry", "Herbs", "Spices", "Other"],
    []
  );

  // Memoize computed stats
  const stats = useMemo(() => {
    const totalProducts = products.length;
    const availableProducts = products.filter((p) => p.isAvailable).length;
    const totalValue = products.reduce((sum, p) => sum + p.price * p.quantity, 0);
    return { totalProducts, availableProducts, totalValue };
  }, [products]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <Package className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Farmer Dashboard</h1>
                <p className="text-sm text-gray-500">{farmer?.farmName}</p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Total Products</h3>
            <p className="text-3xl font-bold text-gray-900">{stats.totalProducts}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Available</h3>
            <p className="text-3xl font-bold text-green-600">{stats.availableProducts}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Total Value</h3>
            <p className="text-3xl font-bold text-gray-900">${stats.totalValue.toFixed(2)}</p>
          </div>
        </div>

        {!showForm ? (
          <>
            {/* Search and Filter Bar */}
            <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
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

            {/* Products List */}
            <ProductList
              products={products}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleAvailability={handleToggleAvailability}
              isLoading={isLoading}
            />
          </>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-sm border">
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
      </main>
    </div>
  );
};

export default FarmerDashboard;

