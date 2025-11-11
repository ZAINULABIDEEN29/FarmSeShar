import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import Container from "../container/Container";

export interface Product {
  id: string;
  name: string;
  price: string;
  rating: number;
  image?: string;
  isNew?: boolean;
}

interface FeaturedProductsSectionProps {
  products?: Product[];
  onViewAll?: () => void;
  onAddToCart?: (product: Product) => void;
}

const defaultProducts: Product[] = [
  {
    id: "1",
    name: "Fresh Whole Milk",
    price: "Rs. 1,200 / kg",
    rating: 4.5,
    isNew: true,
  },
  {
    id: "2",
    name: "Organic Mushroom",
    price: "Rs. 800 / kg",
    rating: 4.8,
    isNew: true,
  },
  {
    id: "3",
    name: "Organic Tomatoes",
    price: "Rs. 600 / kg",
    rating: 4.7,
    isNew: true,
  },
  {
    id: "4",
    name: "Microgreens Herbs",
    price: "Rs. 1,500 / kg",
    rating: 4.9,
    isNew: true,
  },
];

const FeaturedProductsSection: React.FC<FeaturedProductsSectionProps> = ({
  products = defaultProducts,
  onViewAll,
  onAddToCart,
}) => {
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, index) => {
          if (index < fullStars) {
            return (
              <Star
                key={index}
                className="h-4 w-4 fill-yellow-400 text-yellow-400"
              />
            );
          } else if (index === fullStars && hasHalfStar) {
            return (
              <Star
                key={index}
                className="h-4 w-4 fill-yellow-400 text-yellow-400"
              />
            );
          } else {
            return (
              <Star key={index} className="h-4 w-4 fill-gray-200 text-gray-200" />
            );
          }
        })}
        <span className="ml-1 text-sm text-gray-600">{rating}</span>
      </div>
    );
  };

  return (
    <section className="w-full bg-white py-12 md:py-16 lg:py-20">
      <Container>
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-10 md:mb-12 lg:mb-16 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Featured Products
            </h2>
            <p className="text-base md:text-lg text-gray-600 max-w-2xl">
              Discover our handpicked selection of premium organic products
            </p>
          </div>
          <Button
            onClick={onViewAll}
            variant="link"
            className="text-green-600 hover:text-green-700 text-base md:text-lg self-start sm:self-center"
          >
            View All →
          </Button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {products.map((product) => (
            <Card
              key={product.id}
              className="overflow-hidden hover:shadow-lg transition-shadow duration-300 relative"
            >
              {/* NEW Badge */}
              {product.isNew && (
                <Badge
                  variant="secondary"
                  className="absolute top-3 left-3 bg-gray-800 text-white z-10"
                >
                  NEW
                </Badge>
              )}

              {/* Image Placeholder */}
              <div className="w-full h-48 bg-gray-200 flex items-center justify-center relative">
                <span className="text-gray-400 text-sm">Product Image</span>
              </div>

              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {product.name}
                </h3>
                <p className="text-green-600 font-semibold text-lg mb-3">
                  {product.price}
                </p>
                {renderStars(product.rating)}
              </CardContent>

              <div className="px-6 pb-6">
                <Button
                  onClick={() => onAddToCart?.(product)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  Add to Cart
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default FeaturedProductsSection;

