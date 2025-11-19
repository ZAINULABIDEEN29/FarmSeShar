import React from "react";
import Container from "@/components/container/Container";
import { cn } from "@/lib/utils";
interface ImpactStat {
  value: string;
  label: string;
}
const impactStats: ImpactStat[] = [
  {
    value: "40%+",
    label: "Increase In Farmer Earnings",
  },
  {
    value: "2500+",
    label: "Fresh Produce Listings",
  },
  {
    value: "100%",
    label: "Local & Transparent Sourcing",
  },
  {
    value: "500+",
    label: "Local Farmers Empowered",
  },
];
const OurImpact: React.FC = () => {
  return (
    <section className="py-16 sm:py-20 lg:py-24 xl:py-28 bg-white">
      <Container>
        {}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <h2 className="text-3xl sm:text-3xl lg:text-4xl tracking-tight leading-tight font-semibold text-gray-900 mb-4">
            Our Impact
          </h2>
        </div>
        {}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 max-w-7xl mx-auto px-4 sm:px-6">
          {impactStats.map((stat, index) => (
            <div
              key={index}
              className={cn(
                "bg-white rounded-2xl p-6 sm:p-8 lg:p-10",
                "border border-green-600 shadow-sm",
                "flex flex-col items-center text-center",
                "transition-shadow duration-300 hover:shadow-md"
              )}
            >
              {}
              <span className="text-4xl sm:text-5xl lg:text-6xl font-bold text-green-600 mb-4 sm:mb-5 lg:mb-6">
                {stat.value}
              </span>
              {}
              <p className="text-base sm:text-lg text-gray-900 font-normal leading-relaxed">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};
export default OurImpact;
