import React from "react";
import { cn } from "@/lib/utils";
import { Facebook, Chrome, Apple } from "lucide-react";
export type SocialProvider = "facebook" | "google" | "apple";
interface SocialLoginButtonProps {
  provider: SocialProvider;
  onClick?: () => void;
  className?: string;
}
const socialConfig: Record<
  SocialProvider,
  { icon: React.ComponentType<{ className?: string }>; label: string; iconColor: string }
> = {
  facebook: {
    icon: Facebook,
    label: "Facebook",
    iconColor: "text-blue-600",
  },
  google: {
    icon: Chrome,
    label: "Google",
    iconColor: "text-[#4285F4]",
  },
  apple: {
    icon: Apple,
    label: "Apple",
    iconColor: "text-gray-900",
  },
};
const SocialLoginButton: React.FC<SocialLoginButtonProps> = ({
  provider,
  onClick,
  className,
}) => {
  const config = socialConfig[provider];
  const Icon = config.icon;
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center justify-center w-full h-12 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 transition-colors",
        className
      )}
      aria-label={`Login with ${config.label}`}
    >
      <Icon className={cn("h-5 w-5", config.iconColor)} />
    </button>
  );
};
export default SocialLoginButton;
