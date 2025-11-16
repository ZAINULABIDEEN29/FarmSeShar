import React from "react";
import { Button } from "@/components/ui/button";
import Container from "@/components/container/Container";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const AboutHero: React.FC = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/signup");
  };

  const handleLearnMore = () => {
    navigate("/farmer-registration");
  };

  return (
    <section className="bg-green-50 py-20 sm:py-28 lg:py-16 xl:py-18">
      <Container>
        <div className="text-center max-w-4xl mx-auto px-4 sm:px-6">
          {/* Main Headline */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-5xl font-bold text-gray-900 mb-6 sm:mb-8 lg:mb-10 leading-tight tracking-tight">
            Fair Trade. Fresh Produce. Local Impact.
          </h1>
          
          {/* Mission Statement */}
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto mb-10 sm:mb-12 lg:mb-14 leading-relaxed">
            A marketplace designed to empower farmers and make fresh, organic food accessible to everyone.
          </p>
          
          {/* Call-to-Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
            <Button
              onClick={handleGetStarted}
              className={cn(
                "bg-green-600 hover:bg-green-700 text-white font-bold",
                "px-8 sm:px-10 lg:px-12 py-3 sm:py-4 lg:py-6",
                "text-base sm:text-lg lg:text-xl",
                "rounded-lg transition-colors duration-200",
                "inline-flex items-center justify-center",
                "border-none shadow-none w-full sm:w-auto"
              )}
            >
              Get Started
            </Button>
            <Button
              onClick={handleLearnMore}
              variant="outline"
              className={cn(
                "border-2 border-green-600 text-gray-900 hover:bg-green-50 font-semibold",
                "px-8 sm:px-10 lg:px-12 py-3 sm:py-4 lg:py-6",
                "text-base sm:text-lg lg:text-xl",
                "rounded-lg transition-colors duration-200",
                "inline-flex items-center justify-center",
                "bg-white w-full sm:w-auto"
              )}
            >
              Learn more
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default AboutHero;

