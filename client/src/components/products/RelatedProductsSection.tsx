import React from "react";
import ProductGridCard from "./ProductGridCard";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
interface RelatedProduct {
  _id: string;
  name: string;
  price: number;
  unit: string;
  image?: string;
  sellerName: string;
  farmerImage?: string;
  location?: string;
  rating: number;
  category?: string;
  createdAt?: string;
  isAvailable?: boolean;
}
interface RelatedProductsSectionProps {
  products: RelatedProduct[];
  onAddToCart: (productId: string) => void;
  isAuthenticated: boolean;
}
const RelatedProductsSection: React.FC<RelatedProductsSectionProps> = ({
  products,
  onAddToCart,
  isAuthenticated,
}) => {
  const navigate = useNavigate();
  return (
    <div className="mb-8 sm:mb-12">
      {}
      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 text-center">
        You Might Also Like
      </h2>
      {}
      {products && products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="h-full"
            >
              <ProductGridCard
                product={product}
                onAddToCart={(id) => {
                  if (!isAuthenticated) {
                    toast.error("Please login to add items to cart");
                    navigate("/login", { state: { from: window.location.pathname } });
                    return;
                  }
                  onAddToCart(id);
                }}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500 text-sm sm:text-base">
            No related products available at the moment.
          </p>
        </div>
      )}
    </div>
  );
};
export default RelatedProductsSection;
