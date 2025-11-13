import React, { useState, useMemo, useCallback } from "react";
import { Menu, X, LogOut, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  OverviewSection,
  ProductsSection,
  CustomersSection,
  OrdersSection,
  ShipmentsSection,
  HelpSection,
  type DashboardView,
} from "@/components/dashboard";
import { useLogoutFarmer } from "@/hooks/useAuth";
import { useAppSelector } from "@/store/hooks";
import { useGetMyProducts } from "@/hooks/useProducts";
import {
  useDashboardStats,
  useDashboardCustomers,
  useDashboardOrders,
  useDashboardShipments,
} from "@/hooks/useDashboard";
import { cn } from "@/lib/utils";

const FarmerDashboard: React.FC = () => {
  const farmer = useAppSelector((state) => state.auth.farmer);
  const [activeView, setActiveView] = useState<DashboardView>("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const logoutMutation = useLogoutFarmer();

  // Get products for stats
  const { data: products = [] } = useGetMyProducts();

  // Get dashboard statistics
  const { data: statsData, isLoading: isStatsLoading } = useDashboardStats();

  // Get customers (only when customers view is active)
  const { data: customersData, isLoading: isCustomersLoading } = useDashboardCustomers(
    undefined,
    { enabled: activeView === "customers" }
  );

  // Get orders (only when orders view is active)
  const { data: ordersData, isLoading: isOrdersLoading } = useDashboardOrders(
    undefined,
    { enabled: activeView === "orders" }
  );

  // Get shipments (only when shipments view is active)
  const { data: shipmentsData, isLoading: isShipmentsLoading } = useDashboardShipments(
    undefined,
    { enabled: activeView === "shipments" }
  );

  // Compute stats from API data and products
  const stats = useMemo(() => {
    const totalProducts = products.length;
    const availableProducts = statsData?.availableProducts || 0;
    const totalOrders = statsData?.totalOrders || 0;
    const pendingShipments = statsData?.pendingShipments || 0;
    const totalCustomers = statsData?.totalCustomers || 0;

    return {
      totalProducts,
      availableProducts,
      totalOrders,
      pendingShipments,
      totalCustomers,
    };
  }, [products, statsData]);

  const handleLogout = useCallback(() => {
    logoutMutation.mutate();
  }, [logoutMutation]);

  const handleViewChange = useCallback((view: DashboardView) => {
    setActiveView(view);
    // Close sidebar on mobile when selecting a view
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  }, []);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-transparent bg-opacity-10 z-30 lg:hidden transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar
        activeView={activeView}
        onViewChange={handleViewChange}
        className={cn(
          "transition-transform duration-300 ease-in-out",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0"
        )}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col ">
        {/* Header */}
        <header className="bg-white shadow-sm border-b sticky top-0 z-20">
          <div className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                <button
                  onClick={toggleSidebar}
                  className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors shrink-0"
                  aria-label="Toggle sidebar"
                >
                  {isSidebarOpen ? (
                    <X className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700" />
                  ) : (
                    <Menu className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700" />
                  )}
                </button>
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-600 rounded-lg flex items-center justify-center shrink-0">
                    <Package className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <div className="min-w-0">
                    <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate">
                      Farmer Dashboard
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-500 truncate">
                      {farmer?.farmName || "Farm"}
                    </p>
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
                className="hidden sm:flex shrink-0"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
              <button
                onClick={handleLogout}
                className="sm:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors shrink-0"
                aria-label="Logout"
              >
                <LogOut className="h-5 w-5 text-gray-700" />
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto bg-gray-50">
          <div className="max-w-7xl mx-auto w-full">
            {activeView === "overview" && (
              <OverviewSection
                totalProducts={stats.totalProducts}
                totalOrders={stats.totalOrders}
                pendingShipments={stats.pendingShipments}
                totalCustomers={stats.totalCustomers}
                isLoading={isStatsLoading}
              />
            )}

            {activeView === "products" && <ProductsSection />}

            {activeView === "customers" && (
              <CustomersSection
                customers={customersData?.customers || []}
                isLoading={isCustomersLoading}
              />
            )}

            {activeView === "orders" && (
              <OrdersSection
                orders={ordersData?.orders || []}
                isLoading={isOrdersLoading}
              />
            )}

            {activeView === "shipments" && (
              <ShipmentsSection
                shipments={shipmentsData?.shipments || []}
                isLoading={isShipmentsLoading}
              />
            )}

            {activeView === "help" && <HelpSection />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default FarmerDashboard;
