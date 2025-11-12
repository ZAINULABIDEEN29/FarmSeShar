import React from "react";
import { User, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface AccountCartProps {
  cartCount?: number;
  className?: string;
  onAccountClick?: () => void;
  onCartClick?: () => void;
}

const AccountCart: React.FC<AccountCartProps> = ({
  cartCount = 0,
  className,
  onAccountClick,
  onCartClick,
}) => {
  const navigate = useNavigate();
  return (
    <div className={cn("flex items-center gap-3 md:gap-4", className)}>
      <button
        onClick={onAccountClick}
        className="flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
      >
        <User onClick={() => navigate("/login")} className="h-4 w-4" />
        <span>Account</span>
      </button>
      <button
        onClick={onCartClick}
        className="flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
      >
        <ShoppingCart className="h-4 w-4" />
        <span>Cart ({cartCount})</span>
      </button>
    </div>
  );
};

export default AccountCart;

