import React from "react";
import { Package, ShoppingCart, Truck, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface OverviewSectionProps {
  totalProducts: number;
  totalOrders: number;
  pendingShipments: number;
  totalCustomers: number;
  className?: string;
}

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color?: "blue" | "green" | "yellow" | "purple";
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  color = "blue",
  className,
}) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    yellow: "bg-yellow-50 text-yellow-600",
    purple: "bg-purple-50 text-purple-600",
  };

  return (
    <div
      className={cn(
        "bg-white p-4 sm:p-5 lg:p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200",
        className
      )}
    >
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className={cn("p-2.5 sm:p-3 rounded-lg", colorClasses[color])}>
          {icon}
        </div>
      </div>
      <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-1 sm:mb-2">
        {title}
      </h3>
      <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
        {value}
      </p>
    </div>
  );
};

const OverviewSection: React.FC<OverviewSectionProps> = ({
  totalProducts,
  totalOrders,
  pendingShipments,
  totalCustomers,
  className,
}) => {
  return (
    <div className={cn("space-y-6", className)}>
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
          Overview
        </h2>
        <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
          Welcome to your dashboard. Here's a summary of your business metrics.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
        <StatCard
          title="Total Products"
          value={totalProducts}
          icon={<Package className="h-6 w-6" />}
          color="blue"
        />
        <StatCard
          title="Total Orders"
          value={totalOrders}
          icon={<ShoppingCart className="h-6 w-6" />}
          color="green"
        />
        <StatCard
          title="Pending Shipments"
          value={pendingShipments}
          icon={<Truck className="h-6 w-6" />}
          color="yellow"
        />
        <StatCard
          title="Total Customers"
          value={totalCustomers}
          icon={<Users className="h-6 w-6" />}
          color="purple"
        />
      </div>

      {/* Additional Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
            Recent Activity
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <div className="w-2 h-2 bg-green-500 rounded-full shrink-0"></div>
              <span>New order received</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <div className="w-2 h-2 bg-blue-500 rounded-full shrink-0"></div>
              <span>Product updated</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <div className="w-2 h-2 bg-yellow-500 rounded-full shrink-0"></div>
              <span>Shipment in transit</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="space-y-2">
            <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
              Add New Product
            </button>
            <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
              View All Orders
            </button>
            <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
              Track Shipments
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewSection;

