import React, { memo } from "react";
import ProductCard from "./ProductCard";
import type { Product } from "@/types/product.types";

interface ProductListProps {
  products: Product[];
  onEdit?: (product: Product) => void;
  onDelete?: (productId: string) => void;
  onToggleAvailability?: (productId: string) => void;
  isLoading?: boolean;
  emptyMessage?: string;
}

const ProductList: React.FC<ProductListProps> = memo(({
  products,
  onEdit,
  onDelete,
  onToggleAvailability,
  isLoading = false,
  emptyMessage = "No products found. Add your first product to get started!",
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-96 bg-gray-200 animate-pulse rounded-lg"
          />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product._id}
          product={product}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleAvailability={onToggleAvailability}
          isLoading={isLoading}
        />
      ))}
    </div>
  );
});

ProductList.displayName = "ProductList";

export default ProductList;

