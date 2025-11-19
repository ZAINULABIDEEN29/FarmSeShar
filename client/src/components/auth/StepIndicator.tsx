import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  onBack?: () => void;
  backTo?: string;
  className?: string;
}
const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  totalSteps,
  onBack,
  backTo,
  className,
}) => {
  const navigate = useNavigate();
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (backTo) {
      navigate(backTo);
    }
  };
  return (
    <div className={cn("flex items-center gap-2 mb-4", className)}>
      <button
        type="button"
        onClick={handleBack}
        className="inline-flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <span className="text-sm text-gray-600">
        Step {currentStep} of {totalSteps}
      </span>
    </div>
  );
};
export default StepIndicator;
