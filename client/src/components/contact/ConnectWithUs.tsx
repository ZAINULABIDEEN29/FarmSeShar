import React from "react";
import { Instagram, Twitter, Facebook } from "lucide-react";
import Container from "@/components/container/Container";
import { cn } from "@/lib/utils";
interface SocialMediaCard {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  href: string;
}
const socialMediaCards: SocialMediaCard[] = [
  {
    name: "Instagram",
    icon: Instagram,
    description: "Follow us for lifestyle and wellness inspiration",
    href: "https://instagram.com",
  },
  {
    name: "Twitter",
    icon: Twitter,
    description: "Stay updates with our latest news and announcements",
    href: "https://twitter.com",
  },
  {
    name: "Facebook",
    icon: Facebook,
    description: "Join our community and share your experiences",
    href: "https://facebook.com",
  },
];
const ConnectWithUs: React.FC = () => {
  return (
    <section className="py-16 sm:py-20 lg:py-24 xl:py-28 bg-gray-50">
      <Container>
        {}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <h2 className="text-3xl sm:text-5xl lg:text-4xl  font-semibold text-gray-900 mb-4">
            Connect With Us
          </h2>
        </div>
        {}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12 max-w-7xl mx-auto px-4 sm:px-6">
          {socialMediaCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div
                key={index}
                className={cn(
                  "bg-white rounded-2xl p-8 sm:p-10 shadow-sm",
                  "border border-gray-100",
                  "flex flex-col items-center text-center",
                  "transition-shadow duration-300 hover:shadow-md"
                )}
              >
                {}
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl mb-6 sm:mb-8 bg-green-100 flex items-center justify-center">
                  <Icon className="h-10 w-10 sm:h-12 sm:w-12 text-green-600" />
                </div>
                {}
                <h3 className="text-2xl sm:text-3xl  font-bold text-gray-900 mb-4 sm:mb-5">
                  {card.name}
                </h3>
                {}
                <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                  {card.description}
                </p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};
export default ConnectWithUs;
