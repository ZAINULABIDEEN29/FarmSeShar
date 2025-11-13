import React from "react";
import { Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react";

interface SocialLink {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  hoverColor: string;
}

const socialLinks: SocialLink[] = [
  {
    name: "Facebook",
    icon: Facebook,
    color: "bg-blue-500",
    hoverColor: "hover:bg-blue-600",
  },
  {
    name: "Twitter",
    icon: Twitter,
    color: "bg-sky-500",
    hoverColor: "hover:bg-sky-600",
  },
  {
    name: "Instagram",
    icon: Instagram,
    color: "bg-gradient-to-br from-purple-500 to-pink-500",
    hoverColor: "hover:from-purple-600 hover:to-pink-600",
  },
  {
    name: "LinkedIn",
    icon: Linkedin,
    color: "bg-blue-700",
    hoverColor: "hover:bg-blue-800",
  },
  {
    name: "YouTube",
    icon: Youtube,
    color: "bg-red-500",
    hoverColor: "hover:bg-red-600",
  },
];

const SocialLinks: React.FC = () => {
  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-200">
      <div className="text-center mb-6">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          Connect With Us
        </h3>
        <p className="text-sm text-gray-600">
          Follow us on social media for updates, tips, and more
        </p>
      </div>
      
      <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
        {socialLinks.map((social) => {
          const Icon = social.icon;
          return (
            <button
              key={social.name}
              className={`
                group relative p-4 rounded-xl text-white shadow-lg
                transition-all duration-300 hover:scale-110 hover:shadow-xl
                ${social.color} ${social.hoverColor}
              `}
              aria-label={`Visit our ${social.name} page`}
            >
              <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-xs font-medium text-gray-700 whitespace-nowrap">
                {social.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SocialLinks;

