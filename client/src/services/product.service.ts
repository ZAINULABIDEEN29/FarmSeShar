import api from "./api";
import type {
  Product,
  CreateProductInput,
  UpdateProductInput,
  ProductResponse,
  ProductFilters,
} from "@/types/product.types";

// Product API Service Layer
export const productService = {
  // Get all products for the logged-in farmer
  getMyProducts: async (filters?: ProductFilters): Promise<Product[]> => {
    const params = new URLSearchParams();
    if (filters?.category) params.append("category", filters.category);
    if (filters?.minPrice) params.append("minPrice", filters.minPrice.toString());
    if (filters?.maxPrice) params.append("maxPrice", filters.maxPrice.toString());
    if (filters?.isAvailable !== undefined) params.append("isAvailable", filters.isAvailable.toString());
    if (filters?.search) params.append("search", filters.search);

    const queryString = params.toString();
    const url = `/farmers/products${queryString ? `?${queryString}` : ""}`;
    const response = await api.get<{ success: boolean; products: Product[] }>(url);
    return response.data.products || [];
  },

  // Get a single product by ID
  getProductById: async (productId: string): Promise<Product> => {
    const response = await api.get<{ success: boolean; product: Product }>(
      `/farmers/products/${productId}`
    );
    return response.data.product;
  },

  // Create a new product
  createProduct: async (data: CreateProductInput): Promise<ProductResponse> => {
    const response = await api.post<ProductResponse>("/farmers/products", data);
    return response.data;
  },

  // Update a product
  updateProduct: async (productId: string, data: UpdateProductInput): Promise<ProductResponse> => {
    const response = await api.put<ProductResponse>(`/farmers/products/${productId}`, data);
    return response.data;
  },

  // Delete a product
  deleteProduct: async (productId: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete<{ success: boolean; message: string }>(
      `/farmers/products/${productId}`
    );
    return response.data;
  },

  // Toggle product availability
  toggleAvailability: async (productId: string): Promise<ProductResponse> => {
    const response = await api.patch<ProductResponse>(`/farmers/products/${productId}/toggle-availability`);
    return response.data;
  },
};

