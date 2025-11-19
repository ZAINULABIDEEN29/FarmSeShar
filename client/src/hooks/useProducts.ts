import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productService } from "@/services/product.service";
import type { ProductFilters, Product, CreateProductInput, UpdateProductInput } from "@/types/product.types";
import { toast } from "react-toastify";

export const productKeys = {
  all: ["products"] as const,
  my: (filters?: ProductFilters) => [...productKeys.all, "my", filters] as const,
  public: (filters?: ProductFilters) => [...productKeys.all, "public", filters] as const,
  search: (query: string) => [...productKeys.all, "search", query] as const,
  category: (category: string) => [...productKeys.all, "category", category] as const,
  detail: (id: string) => [...productKeys.all, "detail", id] as const,
};

// Alias exports for backward compatibility
export const useGetPublicProducts = (filters?: ProductFilters) => usePublicProducts(filters);
export const useGetPublicProduct = (productId: string) => useProductById(productId);
export const useGetMyProducts = (filters?: ProductFilters) => useMyProducts(filters);

// Public product hooks
export const usePublicProducts = (filters?: ProductFilters) => {
  return useQuery({
    queryKey: productKeys.public(filters),
    queryFn: () => productService.getPublicProducts(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useSearchProducts = (query: string) => {
  return useQuery({
    queryKey: productKeys.search(query),
    queryFn: () => productService.getPublicProducts({ search: query }),
    enabled: query.trim().length > 0,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

export const useProductByCategory = (category: string) => {
  return useQuery({
    queryKey: productKeys.category(category),
    queryFn: () => productService.getPublicProducts({ category }),
    enabled: !!category,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useProductById = (productId: string) => {
  return useQuery({
    queryKey: productKeys.detail(productId),
    queryFn: () => productService.getPublicProductById(productId),
    enabled: !!productId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Farmer product hooks
export const useMyProducts = (filters?: ProductFilters) => {
  return useQuery({
    queryKey: productKeys.my(filters),
    queryFn: () => productService.getMyProducts(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Product mutations
export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateProductInput) => productService.createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
      toast.success("Product created successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create product");
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, data }: { productId: string; data: UpdateProductInput }) =>
      productService.updateProduct(productId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
      queryClient.invalidateQueries({ queryKey: productKeys.detail(variables.productId) });
      toast.success("Product updated successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update product");
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (productId: string) => productService.deleteProduct(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
      toast.success("Product deleted successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete product");
    },
  });
};

export const useToggleProductAvailability = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (productId: string) => productService.toggleAvailability(productId),
    onSuccess: (_, productId) => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
      queryClient.invalidateQueries({ queryKey: productKeys.detail(productId) });
      toast.success("Product availability updated!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update product availability");
    },
  });
};

// Transform function for product cards
// Since the backend already returns products with sellerName, location, farmerImage, and rating,
// we just return the product as-is
export const transformProductForCard = (product: Product): Product => {
  // The backend already provides all necessary fields, so we just return it
  return product;
};
