import React from "react";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface BackLinkProps {
  to: string;
  text?: string;
  className?: string;
}

const BackLink: React.FC<BackLinkProps> = ({
  to,
  text = "Back to login",
  className,
}) => {
  return (
    <Link
      to={to}
      className={cn(
        "inline-flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors mb-6",
        className
      )}
    >
      <ChevronLeft className="h-4 w-4" />
      <span>{text}</span>
    </Link>
  );
};

export default BackLink;

