import React from "react";
import {
  Truck,
  Shield,
  Leaf,
  Clock,
} from "lucide-react";
import Container from "../container/Container";
import { cn } from "@/lib/utils";

interface WhyChooseUsSectionProps {
  className?: string;
}

const WhyChooseUsSection: React.FC<WhyChooseUsSectionProps> = ({
  className,
}) => {
  const features = [
    {
      icon: <Truck className="h-8 w-8 text-gray-600" />,
      title: "Free Delivery",
      description: "Free delivery on orders over Rs.1000",
    },
    {
      icon: <Shield className="h-8 w-8 text-gray-600" />,
      title: "Quality Guarantee",
      description: "100% quality guarantee on all products",
    },
    {
      icon: <Leaf className="h-8 w-8 text-gray-600" />,
      title: "100% Organic",
      description: "Certified organic produce from trusted farmers",
    },
    {
      icon: <Clock className="h-8 w-8 text-gray-600" />,
      title: "Same-Day Fresh",
      description: "Fresh products delivered on the same day",
    },
  ];

  const stats = [
    { value: "10k+", label: "Happy Customers" },
    { value: "10 Years", label: "in Business" },
    { value: "10k+", label: "Products Available" },
    { value: "99%", label: "Customer Satisfaction" },
  ];

  return (
    <section className={cn("w-full bg-white py-12 md:py-16 lg:py-20", className)}>
      <Container>
        {/* Section Header */}
        <div className="text-center mb-10 md:mb-12 lg:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Why Choose LocalHarvest?
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            We are committed to bringing you the freshest, highest quality
            organic produce directly from local farmers
          </p>
        </div>

        {/* Feature Blocks Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-12 md:mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-6"
            >
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-lg"
            >
              <span className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
                {stat.value}
              </span>
              <span className="text-sm md:text-base text-gray-600">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default WhyChooseUsSection;

