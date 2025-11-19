import React from "react";
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  Truck,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
export type DashboardView = "overview" | "products" | "customers" | "orders" | "shipments" | "help";
interface SidebarProps {
  activeView: DashboardView;
  onViewChange: (view: DashboardView) => void;
  className?: string;
}
interface MenuItem {
  id: DashboardView;
  label: string;
  icon: React.ReactNode;
}
const menuItems: MenuItem[] = [
  {
    id: "overview",
    label: "Overview",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    id: "products",
    label: "Products",
    icon: <Package className="h-5 w-5" />,
  },
  {
    id: "customers",
    label: "Customers",
    icon: <Users className="h-5 w-5" />,
  },
  {
    id: "orders",
    label: "Orders",
    icon: <ShoppingCart className="h-5 w-5" />,
  },
  {
    id: "shipments",
    label: "Shipments",
    icon: <Truck className="h-5 w-5" />,
  },
  {
    id: "help",
    label: "Help & Support",
    icon: <HelpCircle className="h-5 w-5" />,
  },
];
const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  onViewChange,
  className,
}) => {
  return (
    <aside
      className={cn(
        " fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 z-40 overflow-y-auto",
        "lg:sticky lg:h-screen lg:z-auto",
        className
      )}
    >
      <div className="h-full  flex flex-col">
        {}
        <div className="p-6 border-b border-gray-200 hidden lg:block">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
              <Package className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Dashboard</h2>
            </div>
          </div>
        </div>
        {}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                "hover:bg-gray-50",
                activeView === item.id
                  ? "bg-green-50 text-green-700 border-l-4 border-green-600 font-semibold"
                  : "text-gray-700 hover:text-gray-900"
              )}
              aria-current={activeView === item.id ? "page" : undefined}
            >
              <span
                className={cn(
                  "shrink-0",
                  activeView === item.id ? "text-green-600" : "text-gray-500"
                )}
              >
                {item.icon}
              </span>
              <span className="truncate">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
};
export default Sidebar;
