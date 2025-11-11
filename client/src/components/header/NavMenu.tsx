import React from "react";
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

const defaultNavItems: NavItem[] = [
  { label: "Home", path: "/" },
  { label: "Vegetables", path: "/vegetables" },
  { label: "Fruits", path: "/fruits" },
  { label: "Dairy", path: "/dairy" },
  { label: "Herbs", path: "/herbs" },
  { label: "About", path: "/about" },
  { label: "Contact", path: "/contact" },
];

const NavMenu: React.FC<NavMenuProps> = ({
  items = defaultNavItems,
  className,
  itemClassName,
  onItemClick,
}) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, item: NavItem) => {
    if (onItemClick) {
      e.preventDefault();
      onItemClick(item);
    }
  };

  return (
    <nav className={cn("hidden md:flex items-center gap-6", className)}>
      {items.map((item) => (
        <a
          key={item.path}
          href={item.path}
          onClick={(e) => handleClick(e, item)}
          className={cn(
            "text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors duration-200 cursor-pointer",
            itemClassName
          )}
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
};

export default NavMenu;

