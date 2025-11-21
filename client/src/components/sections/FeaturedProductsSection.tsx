import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, ShoppingCart, Loader2 } from "lucide-react";
import Container from "../container/Container";
import { useFeaturedProducts } from "@/hooks/useFeaturedProducts";
import { useAddToCart } from "@/hooks/useCart";
import { useAppSelector } from "@/store/hooks";
import type { Product } from "@/types/product.types";

interface FeaturedProductsSectionProps {
  onViewAll?: () => void;
}

const FeaturedProductsSection: React.FC<FeaturedProductsSectionProps> = ({
  onViewAll,
}) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { products, isLoading } = useFeaturedProducts();
  const addToCartMutation = useAddToCart();

  const formatPrice = (price: number, unit: string): string => {
    return `Rs. ${price.toLocaleString()} / ${unit}`;
  };

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  const handleAddToCart = async (
    e: React.MouseEvent<HTMLButtonElement>,
    product: Product
  ) => {
    e.stopPropagation();
    
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    addToCartMutation.mutate({
      productId: product._id,
      quantity: 1,
    });
  };

  const renderStars = (rating: number = 0) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, index) => {
          if (index < fullStars) {
            return (
              <Star
                key={index}
                className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400"
              />
            );
          } else if (index === fullStars && hasHalfStar) {
            return (
              <Star
                key={index}
                className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400"
              />
            );
          } else {
            return (
              <Star
                key={index}
                className="h-3 w-3 sm:h-4 sm:w-4 fill-gray-200 text-gray-200"
              />
            );
          }
        })}
        {rating > 0 && (
          <span className="ml-1 text-xs sm:text-sm text-gray-600">
            {rating.toFixed(1)}
          </span>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <section className="w-full bg-white py-12 md:py-16 lg:py-20">
        <Container>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-10 md:mb-12 lg:mb-16 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                Featured Products
              </h2>
              <p className="text-base md:text-lg text-gray-600 max-w-2xl">
                Discover our handpicked selection of premium organic products
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {[...Array(4)].map((_, index) => (
              <Card
                key={index}
                className="overflow-hidden animate-pulse"
              >
                <div className="w-full h-48 bg-gray-200" />
                <CardContent className="p-4 sm:p-6">
                  <div className="h-4 bg-gray-200 rounded mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-3" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="w-full bg-white py-12 md:py-16 lg:py-20">
      <Container>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 sm:mb-10 md:mb-12 lg:mb-16 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2 sm:mb-4">
              Featured Products
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl">
              Discover our handpicked selection of premium organic products
            </p>
          </div>
          {onViewAll && (
            <Button
              onClick={onViewAll}
              variant="link"
              className="text-green-600 hover:text-green-700 text-sm sm:text-base md:text-lg self-start sm:self-center p-0 h-auto"
            >
              View All →
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {products.map((product) => {
            const productImage = product.images?.[0] || product.image || "";
            const isNew =
              product.createdAt &&
              new Date(product.createdAt) >
                new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

            return (
              <Card
                key={product._id}
                className="overflow-hidden hover:shadow-lg transition-all duration-300 relative cursor-pointer group flex flex-col"
                onClick={() => handleProductClick(product._id)}
              >
                {isNew && (
                  <Badge
                    variant="secondary"
                    className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-gray-800 text-white z-10 text-xs px-2 py-0.5"
                  >
                    NEW
                  </Badge>
                )}

                <div className="w-full h-40 sm:h-48 md:h-52 bg-gray-100 relative overflow-hidden">
                  {productImage ? (
                    <img
                      src={productImage}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <ShoppingCart className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                </div>

                <CardContent className="p-4 sm:p-5 md:p-6 flex-1 flex flex-col">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-green-600 font-semibold text-base sm:text-lg mb-2 sm:mb-3">
                    {formatPrice(product.price, product.unit)}
                  </p>
                  <div className="mb-3 sm:mb-4">{renderStars(product.rating)}</div>

                  <Button
                    onClick={(e) => handleAddToCart(e, product)}
                    disabled={!product.isAvailable || addToCartMutation.isPending}
                    className="w-full bg-green-600 hover:bg-green-700 text-white text-sm sm:text-base py-2 sm:py-2.5 disabled:opacity-50 disabled:cursor-not-allowed mt-auto"
                  >
                    {addToCartMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to Cart
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </Container>
    </section>
  );
};

export default FeaturedProductsSection;
