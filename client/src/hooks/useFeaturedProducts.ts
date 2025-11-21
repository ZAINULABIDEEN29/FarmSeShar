import { useQueries } from "@tanstack/react-query";
import { productService } from "@/services/product.service";
import type { Product } from "@/types/product.types";

const CATEGORIES = ["Vegetables", "Fruits", "Dairy", "Herbs"] as const;

/**
 * Hook to fetch one product from each category for featured products section
 */
export const useFeaturedProducts = () => {
  const queries = useQueries({
    queries: CATEGORIES.map((category) => ({
      queryKey: ["featured-products", category],
      queryFn: async () => {
        const products = await productService.getPublicProducts({ category });
        // Return the first available product from the category
        return products.find((p) => p.isAvailable) || null;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    })),
  });

  const products = queries
    .map((query) => query.data)
    .filter((product): product is Product => product !== null && product !== undefined);

  const isLoading = queries.some((query) => query.isLoading);
  const isError = queries.some((query) => query.isError);

  return {
    products,
    isLoading,
    isError,
  };
};

