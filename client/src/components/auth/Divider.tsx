import React from "react";
import { cn } from "@/lib/utils";
interface DividerProps {
  text?: string;
  className?: string;
}
const Divider: React.FC<DividerProps> = ({ text, className }) => {
  return (
    <div className={cn("flex items-center gap-4 my-6", className)}>
      <div className="flex-1 h-px bg-gray-300" />
      {text && (
        <span className="text-sm text-gray-500 font-medium">{text}</span>
      )}
      <div className="flex-1 h-px bg-gray-300" />
    </div>
  );
};
export default Divider;
