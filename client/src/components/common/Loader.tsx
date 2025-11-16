import React from "react";
import { cn } from "@/lib/utils";

interface LoaderProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  fullScreen?: boolean;
}

const Loader: React.FC<LoaderProps> = ({
  size = "md",
  className,
  fullScreen = false,
}) => {
  const sizeClasses = {
    sm: "w-6 h-6 border-2",
    md: "w-10 h-10 border-2",
    lg: "w-16 h-16 border-4",
  };

  const spinnerClasses = cn(
    "border-green-600 border-t-transparent rounded-full animate-spin",
    sizeClasses[size],
    className
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="flex flex-col items-center gap-4">
          <div className={spinnerClasses} />
          <p className="text-sm font-medium text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-8">
      <div className={spinnerClasses} />
    </div>
  );
};

interface PageLoaderProps {
  message?: string;
}

export const PageLoader: React.FC<PageLoaderProps> = ({
  message = "Loading...",
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          {/* Outer spinner */}
          <div className="w-16 h-16 border-4 border-green-100 border-t-green-600 rounded-full animate-spin" />
          {/* Inner spinner */}
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-green-400 rounded-full animate-spin" style={{ animationDirection: "reverse", animationDuration: "1s" }} />
        </div>
        <p className="text-base font-medium text-gray-700">{message}</p>
      </div>
    </div>
  );
};

interface InlineLoaderProps {
  message?: string;
  className?: string;
}

export const InlineLoader: React.FC<InlineLoaderProps> = ({
  message,
  className,
}) => {
  return (
    <div className={cn("flex items-center justify-center gap-3 py-4", className)}>
      <div className="w-6 h-6 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
      {message && <p className="text-sm text-gray-600">{message}</p>}
    </div>
  );
};

export default Loader;

