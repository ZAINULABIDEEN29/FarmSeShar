import React, { useRef, useEffect } from "react";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccountDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  userName?: string;
  className?: string;
}

const AccountDropdown: React.FC<AccountDropdownProps> = ({
  isOpen,
  onClose,
  onLogout,
  userName,
  className,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isOpen, onClose]);

  // Close dropdown on Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className={cn(
        "absolute top-full right-0 mt-0 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50",
        className
      )}
      role="menu"
      aria-orientation="vertical"
      aria-labelledby="account-button"
    >
      {/* User Info */}
      {userName && (
        <div className="px-4 py-2 border-b border-gray-100">
          <p className="text-sm font-medium text-gray-900 truncate">
            {userName}
          </p>
        </div>
      )}

      {/* Logout Button */}
      <button
        onClick={onLogout}
        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors text-left"
        role="menuitem"
        aria-label="Logout"
      >
        <LogOut className="h-4 w-4" />
        <span>Logout</span>
      </button>
    </div>
  );
};

export default AccountDropdown;

