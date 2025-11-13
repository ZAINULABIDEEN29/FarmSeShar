import React from "react";
import {  Mail, Phone, MessageCircle, FileText, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

interface HelpSectionProps {
  className?: string;
}

interface HelpCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: string;
  onClick?: () => void;
  className?: string;
}

const HelpCard: React.FC<HelpCardProps> = ({
  icon,
  title,
  description,
  action,
  onClick,
  className,
}) => {
  return (
    <div
      className={cn(
        "bg-white p-5 sm:p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-start gap-4">
        <div className="p-3 bg-green-50 text-green-600 rounded-lg shrink-0">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
            {title}
          </h3>
          <p className="text-sm text-gray-600 mb-3">{description}</p>
          {action && (
            <button className="text-sm font-medium text-green-600 hover:text-green-700 transition-colors">
              {action} →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const HelpSection: React.FC<HelpSectionProps> = ({ className }) => {
  const handleContact = (method: string) => {
    // Handle contact method
    console.log(`Contact via ${method}`);
  };

  return (
    <div className={cn("space-y-6", className)}>
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
          Help & Support
        </h2>
        <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
          Get assistance with your dashboard, manage your account, or contact our support team.
        </p>
      </div>

      {/* Quick Help Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <HelpCard
          icon={<BookOpen className="h-5 w-5 sm:h-6 sm:w-6" />}
          title="Documentation"
          description="Browse our comprehensive guides and tutorials to learn how to use the dashboard effectively."
          action="View Docs"
          onClick={() => handleContact("documentation")}
        />
        <HelpCard
          icon={<FileText className="h-5 w-5 sm:h-6 sm:w-6" />}
          title="FAQs"
          description="Find answers to frequently asked questions about products, orders, shipments, and more."
          action="View FAQs"
          onClick={() => handleContact("faq")}
        />
      </div>

      {/* Contact Support */}
      <div className="bg-white p-5 sm:p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">
          Contact Support
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <button
            onClick={() => handleContact("email")}
            className="flex flex-col items-center gap-3 p-4 sm:p-5 rounded-lg border border-gray-200 hover:border-green-500 hover:bg-green-50 transition-all duration-200 text-center"
          >
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
              <Mail className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-1">
                Email Support
              </h4>
              <p className="text-xs sm:text-sm text-gray-600">
                support@farmers.com
              </p>
            </div>
          </button>

          <button
            onClick={() => handleContact("phone")}
            className="flex flex-col items-center gap-3 p-4 sm:p-5 rounded-lg border border-gray-200 hover:border-green-500 hover:bg-green-50 transition-all duration-200 text-center"
          >
            <div className="p-3 bg-green-50 text-green-600 rounded-lg">
              <Phone className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-1">
                Phone Support
              </h4>
              <p className="text-xs sm:text-sm text-gray-600">
                (0)-2347-1008
              </p>
            </div>
          </button>

          <button
            onClick={() => handleContact("chat")}
            className="flex flex-col items-center gap-3 p-4 sm:p-5 rounded-lg border border-gray-200 hover:border-green-500 hover:bg-green-50 transition-all duration-200 text-center sm:col-span-2 lg:col-span-1"
          >
            <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
              <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-1">
                Live Chat
              </h4>
              <p className="text-xs sm:text-sm text-gray-600">
                Available 24/7
              </p>
            </div>
          </button>
        </div>
      </div>

     
    </div>
  );
};

export default HelpSection;

