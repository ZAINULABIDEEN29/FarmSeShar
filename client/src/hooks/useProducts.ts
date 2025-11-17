import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { productService } from "@/services/product.service";
import type {
  CreateProductInput,
  UpdateProductInput,
  ProductFilters,
  Product,
} from "@/types/product.types";

// Query Keys
export const productKeys = {
  all: ["products"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  list: (filters?: ProductFilters) => [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all, "detail"] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
  public: ["public-products"] as const,
  publicLists: () => [...productKeys.public, "list"] as const,
  publicList: (filters?: ProductFilters) => [...productKeys.publicLists(), filters] as const,
  publicDetails: () => [...productKeys.public, "detail"] as const,
  publicDetail: (id: string) => [...productKeys.publicDetails(), id] as const,
};

// Get all products for farmer
export const useGetMyProducts = (filters?: ProductFilters) => {
  return useQuery({
    queryKey: productKeys.list(filters),
    queryFn: () => productService.getMyProducts(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Get single product
export const useGetProduct = (productId: string, enabled = true) => {
  return useQuery({
    queryKey: productKeys.detail(productId),
    queryFn: () => productService.getProductById(productId),
    enabled: enabled && !!productId,
  });
};

// Create product mutation
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProductInput) => productService.createProduct(data),
    onSuccess: (response) => {
      toast.success(response.message || "Product created successfully!");
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || error.message || "Failed to create product.";
      toast.error(errorMessage);
    },
  });
};

// Update product mutation
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, data }: { productId: string; data: UpdateProductInput }) =>
      productService.updateProduct(productId, data),
    onSuccess: (response, variables) => {
      toast.success(response.message || "Product updated successfully!");
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productKeys.detail(variables.productId) });
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || error.message || "Failed to update product.";
      toast.error(errorMessage);
    },
  });
};

// Delete product mutation
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) => productService.deleteProduct(productId),
    onSuccess: (response) => {
      toast.success(response.message || "Product deleted successfully!");
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || error.message || "Failed to delete product.";
      toast.error(errorMessage);
    },
  });
};

// Toggle product availability mutation
export const useToggleProductAvailability = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) => productService.toggleAvailability(productId),
    onSuccess: (response, productId) => {
      toast.success(response.message || "Product availability updated!");
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productKeys.detail(productId) });
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || error.message || "Failed to update availability.";
      toast.error(errorMessage);
    },
  });
};

// Public product hooks (for customers browsing)
export const useGetPublicProducts = (filters?: ProductFilters) => {
  return useQuery({
    queryKey: productKeys.publicList(filters),
    queryFn: () => productService.getPublicProducts(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useGetPublicProduct = (productId: string, enabled = true) => {
  return useQuery({
    queryKey: productKeys.publicDetail(productId),
    queryFn: () => productService.getPublicProductById(productId),
    enabled: enabled && !!productId,
  });
};

// Helper function to transform API product to match ProductGridCard format
export const transformProductForCard = (product: Product): Product & { 
  sellerName: string; 
  rating: number;
  location?: string;
  farmerImage?: string;
} => {
  // If product already has all required legacy fields, return as is
  if (product.sellerName && product.rating !== undefined) {
    return {
      ...product,
      sellerName: product.sellerName,
      rating: product.rating,
      location: product.location || product.farmer?.farmLocation || "Unknown Location",
      farmerImage: product.farmerImage || (product.farmer 
        ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${product.farmer.fullName.firstName}${product.farmer.fullName.lastName}`
        : undefined),
    };
  }

  // Transform farmer info to legacy format
  if (product.farmer) {
    const firstName = product.farmer.fullName?.firstName || "";
    const lastName = product.farmer.fullName?.lastName || "";
    const sellerName = firstName && lastName 
      ? `${firstName} ${lastName}`.trim()
      : product.farmer.farmName || "Unknown Farmer";
    
    return {
      ...product,
      sellerName,
      location: product.farmer.farmLocation || product.location || "Unknown Location",
      farmerImage: product.farmerImage || (firstName || lastName
        ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${firstName}${lastName}`
        : undefined),
      rating: product.rating || 4.5, // Default rating, can be enhanced later
    };
  }

  // Fallback if no farmer info
  return {
    ...product,
    sellerName: product.sellerName || "Unknown Farmer",
    location: product.location || "Unknown Location",
    rating: product.rating || 4.0,
    farmerImage: product.farmerImage,
  };
};

