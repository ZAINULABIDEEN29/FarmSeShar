import React from "react";
import { cn } from "@/lib/utils";

interface TopInfoBarProps {
  deliveryText?: string;
  supportText?: string;
  className?: string;
}

const TopInfoBar: React.FC<TopInfoBarProps> = ({
  deliveryText = "Free Delivery over Rs.3000",
  supportText = "Support: (0)-2047-1008",
  className,
}) => {
  return (
    <div
      className={cn(
        "flex items-center gap-3 text-sm text-gray-500",
        className
      )}
    >
      <span>{deliveryText}</span>
      <span className="text-gray-300">|</span>
      <span>{supportText}</span>
    </div>
  );
};

export default TopInfoBar;

