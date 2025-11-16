import React from "react";
import { Users, Code, Shield, Leaf } from "lucide-react";
import Container from "@/components/container/Container";
import { cn } from "@/lib/utils";

interface Value {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  iconShape: "circle" | "square";
}

const values: Value[] = [
  {
    icon: Users,
    title: "Fair Trade",
    description: "Empowering farmers with direct earnings. We optimize for farmer welfare and community benefit.",
    iconShape: "circle",
  },
  {
    icon: Code,
    title: "Tech for Good",
    description: "Leveraging technology to solve real agricultural challenges.",
    iconShape: "square",
  },
  {
    icon: Shield,
    title: "Integrity",
    description: "Ensuring honest interactions, fair pricing, and reliable service.",
    iconShape: "square",
  },
  {
    icon: Leaf,
    title: "Local First",
    description: "We prioritize fresh, high-quality produce sourced directly from local farms.",
    iconShape: "circle",
  },
];

const OurValues: React.FC = () => {
  return (
    <section className="py-16 sm:py-20 lg:py-24 xl:py-28 bg-white">
      <Container>
        {/* Centered heading */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <h2 className="text-3xl sm:text-3xl lg:text-4xl tracking-tight leading-tight font-semibold text-gray-900 mb-4">
            Our Values
          </h2>
        </div>

        {/* Values Grid - 2x2 layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 max-w-7xl mx-auto px-4 sm:px-6">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <div
                key={index}
                className={cn(
                  "bg-white rounded-2xl p-6 sm:p-8 lg:p-10 shadow-sm",
                  "border border-gray-100",
                  "transition-shadow duration-300 hover:shadow-md",
                  "flex flex-col items-start text-left"
                )}
              >
                {/* Icon with green background - circular or square */}
                <div className={cn(
                  "w-16 h-16 sm:w-20 sm:h-20 mb-5 sm:mb-6 bg-green-100 flex items-center justify-center",
                  value.iconShape === "circle" ? "rounded-full" : "rounded-2xl"
                )}>
                  <Icon className="h-8 w-8 sm:h-10 sm:w-10 text-green-600" />
                </div>
                
                {/* Title - Bold dark gray */}
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                  {value.title}
                </h3>
                
                {/* Description - Smaller dark gray */}
                <p className="text-sm sm:text-base text-gray-900 leading-relaxed font-normal">
                  {value.description}
                </p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};

export default OurValues;
