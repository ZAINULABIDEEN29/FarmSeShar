import React from "react";
import { Briefcase, MessageCircle, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import Container from "@/components/container/Container";
import { cn } from "@/lib/utils";

interface SupportCard {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  email: string;
}

const supportCards: SupportCard[] = [
  {
    icon: Briefcase,
    title: "Career Opportunities",
    description: "Want to join our team, we'd love to hear from you.",
    email: "localharvest@company.com",
  },
  {
    icon: MessageCircle,
    title: "General Inquiries",
    description: "For all other questions or feedback",
    email: "localharvest@company.com",
  },
  {
    icon: Shield,
    title: "Privacy & Data Questions",
    description: "Want to join our team, we'd love to hear from you",
    email: "privacyteam@company.com",
  },
];

const SupportHero: React.FC = () => {
  const handleGetStarted = () => {
    const contactSection = document.getElementById("get-in-touch");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      {/* Hero Section - Solid uniform light green background */}
      <section className="bg-green-50 py-20 sm:py-28 lg:py-32 xl:py-16">
        <Container>
          <div className="text-center max-w-4xl mx-auto px-4 sm:px-6">
            {/* Large, bold, dark gray heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-6xl font-bold text-gray-900 mb-6 sm:mb-8 lg:mb-10 leading-tight tracking-tight">
              We're Here to Support You
            </h1>
            
            {/* Medium gray paragraph text */}
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto mb-10 sm:mb-12 lg:mb-14 leading-relaxed">
              If you have questions or need assistance, we're here to help. Please select the most relevant option below so we can provide the best possible support.
            </p>
            
            {/* Solid vibrant green button with white text, no icons */}
            <Button
              onClick={handleGetStarted}
              className={cn(
                "bg-green-600 hover:bg-green-700 text-white font-bold",
                "px-8 sm:px-10 lg:px-12 py-3 sm:py-4 lg:py-6",
                "text-base sm:text-lg lg:text-xl",
                "rounded-lg transition-colors duration-200",
                "inline-flex items-center justify-center",
                "shadow-none border-none"
              )}
            >
              Get Started
            </Button>
          </div>
        </Container>
      </section>

      {/* Support Cards Section - Solid white background */}
      <section className="bg-white py-16 sm:py-20 lg:py-24">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12 max-w-7xl mx-auto px-4 sm:px-6">
            {supportCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <div
                  key={index}
                  className={cn(
                    "bg-white rounded-2xl p-6 sm:p-8 lg:p-10 shadow-sm",
                    "border border-gray-100",
                    "flex flex-col h-full transition-shadow duration-300",
                    "hover:shadow-md"
                  )}
                >
                  {/* Light green square icon container with dark green icon */}
                  <div className="mb-6 sm:mb-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 lg:w-18 lg:h-18 bg-green-100 rounded-xl">
                      <Icon className="h-7 w-7 sm:h-8 sm:w-8 lg:h-9 lg:w-9 text-green-700" />
                    </div>
                  </div>
                  
                  {/* Bold dark gray title */}
                  <h3 className="text-xl sm:text-2xl lg:text-2xl font-bold text-gray-900 mb-4 sm:mb-5 lg:mb-6">
                    {card.title}
                  </h3>
                  
                  {/* Gray description text */}
                  <p className="text-sm sm:text-base lg:text-lg text-gray-600 mb-6 sm:mb-8 lg:mb-10 grow leading-relaxed">
                    {card.description}
                  </p>
                  
                  {/* Green email link at bottom - no arrows */}
                  <a
                    href={`mailto:${card.email}`}
                    className="text-sm sm:text-base lg:text-lg font-medium text-green-600 hover:text-green-700 transition-colors duration-200 self-start"
                  >
                    {card.email}
                  </a>
                </div>
              );
            })}
          </div>
        </Container>
      </section>
    </>
  );
};

export default SupportHero;
