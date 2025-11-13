import React from "react";
import { cn } from "@/lib/utils";

interface ContactInfoCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  content: string;
  subContent?: string;
  color: "blue" | "green" | "purple" | "orange" | "pink";
  className?: string;
}

const ContactInfoCard: React.FC<ContactInfoCardProps> = ({
  icon: Icon,
  title,
  content,
  subContent,
  color,
  className,
}) => {
  const colorClasses = {
    blue: "from-blue-500 to-blue-600 shadow-blue-200",
    green: "from-green-500 to-green-600 shadow-green-200",
    purple: "from-purple-500 to-purple-600 shadow-purple-200",
    orange: "from-orange-500 to-orange-600 shadow-orange-200",
    pink: "from-pink-500 to-pink-600 shadow-pink-200",
  };

  return (
    <div
      className={cn(
        "group relative bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 hover:border-transparent transition-all duration-300 hover:shadow-xl overflow-hidden",
        className
      )}
    >
      {/* Gradient Background on Hover */}
      <div
        className={cn(
          "absolute inset-0 bg-linear-to-br opacity-0 group-hover:opacity-5 transition-opacity duration-300",
          colorClasses[color]
        )}
      />

      {/* Animated Border */}
      <div
        className={cn(
          "absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300",
          `bg-linear-to-r ${colorClasses[color]}`
        )}
        style={{
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "exclude",
          WebkitMaskComposite: "xor",
          padding: "1px",
        }}
      />

      <div className="relative flex items-start gap-4 sm:gap-5">
        <div
          className={cn(
            "p-4 rounded-xl bg-linear-to-br shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3",
            colorClasses[color]
          )}
        >
          <Icon className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-2 group-hover:text-gray-800 transition-colors">
            {title}
          </h3>
          <p className="text-base sm:text-lg font-semibold text-gray-700 mb-1 group-hover:text-gray-900 transition-colors">
            {content}
          </p>
          {subContent && (
            <p className="text-xs sm:text-sm text-gray-500 group-hover:text-gray-600 transition-colors">
              {subContent}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactInfoCard;

