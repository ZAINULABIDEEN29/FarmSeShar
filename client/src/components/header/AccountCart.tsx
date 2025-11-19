import React, { useState } from "react";
import { User, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import AccountDropdown from "./AccountDropdown";
interface AccountCartProps {
  cartCount?: number;
  className?: string;
  onAccountClick?: () => void;
  onCartClick?: () => void;
  onLogout?: () => void;
  userName?: string;
  isLoggedIn?: boolean;
}
const AccountCart: React.FC<AccountCartProps> = ({
  cartCount = 0,
  className,
  onAccountClick,
  onCartClick,
  onLogout,
  userName,
  isLoggedIn = false,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const accountLabel = userName || "Account";
  const handleAccountClick = () => {
    if (isLoggedIn) {
      setIsDropdownOpen((prev) => !prev);
    } else {
      onAccountClick?.();
    }
  };
  const handleMouseEnter = () => {
    if (isLoggedIn) {
      setIsDropdownOpen(true);
    }
  };
  const handleMouseLeave = () => {
    if (window.matchMedia("(min-width: 640px)").matches) {
      setIsDropdownOpen(false);
    }
  };
  const handleLogout = () => {
    setIsDropdownOpen(false);
    onLogout?.();
  };
  return (
    <div className={cn("flex items-center gap-3 md:gap-4", className)}>
      {}
      <div
        className="relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <button
          id="account-button"
          onClick={handleAccountClick}
          className="flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
          aria-label={userName ? `Account: ${userName}` : "Account"}
          aria-expanded={isDropdownOpen}
          aria-haspopup="true"
        >
          <User className="h-4 w-4" />
          <span className="max-w-[120px] truncate">{accountLabel}</span>
        </button>
        {}
        {isLoggedIn && (
          <AccountDropdown
            isOpen={isDropdownOpen}
            onClose={() => setIsDropdownOpen(false)}
            onLogout={handleLogout}
            userName={userName}
          />
        )}
      </div>
      {}
      <button
        onClick={onCartClick}
        className="flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
        aria-label={`View cart with ${cartCount} items`}
      >
        <ShoppingCart className="h-4 w-4" />
        <span>Cart ({cartCount})</span>
      </button>
    </div>
  );
};
export default AccountCart;
