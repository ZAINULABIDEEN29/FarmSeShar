import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Container from "../container/Container";

export interface Category {
  id: string;
  title: string;
  description: string;
  image?: string;
}

interface ShopByCategorySectionProps {
  categories?: Category[];
  onCategoryClick?: (category: Category) => void;
}

const defaultCategories: Category[] = [
  {
    id: "1",
    title: "Fresh Vegetables",
    description: "Farm-fresh vegetables delivered daily",
  },
  {
    id: "2",
    title: "Nutritious Fruits",
    description: "Organic fruits picked at peak ripeness",
  },
  {
    id: "3",
    title: "Dairy Products",
    description: "Fresh dairy products from local farms",
  },
  {
    id: "4",
    title: "Healthy Spices",
    description: "Aromatic spices and herbs",
  },
];

const ShopByCategorySection: React.FC<ShopByCategorySectionProps> = ({
  categories = defaultCategories,
  onCategoryClick,
}) => {
  return (
    <section className="w-full bg-white py-12 md:py-16 lg:py-20">
      <Container>
        {/* Section Header */}
        <div className="text-center mb-10 md:mb-12 lg:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Shop By Category
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our wide range of organic products organized by category for
            your convenience
          </p>
        </div>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {categories.map((category) => (
            <Card
              key={category.id}
              className="overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              {/* Image Placeholder */}
              <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400 text-sm">Category Image</span>
              </div>

              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {category.title}
                </h3>
                <p className="text-sm text-gray-600">{category.description}</p>
              </CardContent>

              <CardFooter className="p-6 pt-0">
                <Button
                  onClick={() => onCategoryClick?.(category)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  Shop Category
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default ShopByCategorySection;

