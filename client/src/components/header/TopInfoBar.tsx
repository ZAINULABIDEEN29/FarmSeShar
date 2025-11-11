import React from "react";
import { cn } from "@/lib/utils";

interface TopInfoBarProps {
  deliveryText?: string;
  supportText?: string;
  className?: string;
}

const TopInfoBar: React.FC<TopInfoBarProps> = ({
  deliveryText = "Free Delivery over Rs.1000",
  supportText = "Support: (111)-2347-1968",
  className,
}) => {
  return (
    <div
      className={cn(
        "flex items-center gap-2 text-sm text-gray-700",
        className
      )}
    >
      <span>{deliveryText}</span>
      <span className="text-gray-400">|</span>
      <span>{supportText}</span>
    </div>
  );
};

export default TopInfoBar;

