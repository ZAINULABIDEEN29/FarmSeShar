import React, { useMemo } from "react";
import { useGetPublicProducts, transformProductForCard } from "./useProducts";
import type { Product } from "@/types/product.types";
import Loader from "@/components/common/Loader";
export interface TransformedProduct extends Product {
  sellerName: string;
  rating: number;
  location?: string;
  farmerImage?: string;
}
interface UseCategoryProductsOptions {
  category: string;
  itemsPerPage?: number;
}
interface UseCategoryProductsReturn {
  products: TransformedProduct[];
  isLoading: boolean;
  error: Error | null;
  isEmpty: boolean;
  LoaderComponent: React.ReactNode;
  ErrorComponent: React.ReactNode;
  EmptyComponent: React.ReactNode;
}
export const useCategoryProducts = ({
  category,
  itemsPerPage = 12,
}: UseCategoryProductsOptions): UseCategoryProductsReturn => {
  const { data: products = [], isLoading, error } = useGetPublicProducts({ category });
  const transformedProducts = useMemo(() => {
    if (!products || products.length === 0) {
      return [];
    }
    return products.map(transformProductForCard) as TransformedProduct[];
  }, [products]);
  const isEmpty = !isLoading && !error && transformedProducts.length === 0;
  const LoaderComponent = (
    <div className="flex justify-center items-center py-12">
      <Loader />
    </div>
  );
  const ErrorComponent = (
    <div className="text-center py-12">
      <p className="text-red-600">Error loading products. Please try again later.</p>
      {error && (
        <p className="text-sm text-gray-500 mt-2">
          {error instanceof Error ? error.message : "Unknown error occurred"}
        </p>
      )}
    </div>
  );
  const EmptyComponent = (
    <div className="text-center py-12">
      <p className="text-gray-600">No products found in this category.</p>
      <p className="text-sm text-gray-500 mt-2">
        Check back later or try a different category.
      </p>
    </div>
  );
  return {
    products: transformedProducts,
    isLoading,
    error: error as Error | null,
    isEmpty,
    LoaderComponent,
    ErrorComponent,
    EmptyComponent,
  };
};
