import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

export interface NavItem {
  label: string;
  path: string;
}

interface NavMenuProps {
  items?: NavItem[];
  className?: string;
  itemClassName?: string;
  onItemClick?: (item: NavItem) => void;
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Home", path: "/" },
  { label: "Vegetables", path: "/vegetables" },
  { label: "Fruits", path: "/fruits" },
  { label: "Dairy", path: "/dairy" },
  { label: "Herbs", path: "/herbs" },
  { label: "About", path: "/about" },
  { label: "Contact", path: "/contact" },
];

const NavMenu: React.FC<NavMenuProps> = ({
  items = NAV_ITEMS,
  className,
  itemClassName,
  onItemClick,
}) => {
  const location = useLocation();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, item: NavItem) => {
    if (onItemClick) {
      e.preventDefault();
      onItemClick(item);
    }
  };

  return (
    <nav
      className={cn(
        "hidden md:flex items-center gap-6 lg:gap-8",
        className
      )}
    >
      {items.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            onClick={(e: React.MouseEvent<HTMLAnchorElement>) => handleClick(e, item)}
            className={cn(
              "text-base font-semibold transition-colors duration-200 cursor-pointer relative",
              isActive
                ? "text-green-600"
                : "text-gray-900 hover:text-green-600",
              itemClassName
            )}
          >
            {item.label}
            {isActive && (
              <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-green-600 rounded-full" />
            )}
          </Link>
        );
      })}
    </nav>
  );
};

export default NavMenu;

