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
  type DashboardView,
} from "@/components/dashboard";
import { useLogoutFarmer } from "@/hooks/useAuth";
import { useAppSelector } from "@/store/hooks";
import { useGetMyProducts } from "@/hooks/useProducts";
import type { Customer, Order, Shipment } from "@/types/dashboard.types";
import { cn } from "@/lib/utils";

// Mock data for customers, orders, and shipments (replace with API calls later)
const mockCustomers: Customer[] = [
  {
    _id: "1",
    fullName: { firstName: "John", lastName: "Doe" },
    email: "john.doe@example.com",
    phoneNumber: "+1234567890",
    totalOrders: 5,
    totalSpent: 1250.0,
    lastOrderDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    _id: "2",
    fullName: { firstName: "Jane", lastName: "Smith" },
    email: "jane.smith@example.com",
    phoneNumber: "+1234567891",
    totalOrders: 3,
    totalSpent: 850.5,
    lastOrderDate: new Date(Date.now() - 86400000).toISOString(),
    createdAt: new Date().toISOString(),
  },
];

const mockOrders: Order[] = [
  {
    _id: "1",
    orderId: "ORD-001",
    customerId: "1",
    customerName: "John Doe",
    items: [
      {
        productId: "1",
        productName: "Organic Tomatoes",
        quantity: 2,
        unit: "Kg",
        price: 80,
        total: 160,
      },
    ],
    totalAmount: 361,
    status: "confirmed",
    shippingAddress: {
      streetAddress: "123 Main St",
      houseNo: "Apt 4B",
      town: "Downtown",
      city: "Lahore",
      country: "Pakistan",
      postalCode: "54000",
    },
    paymentMethod: "card",
    createdAt: new Date().toISOString(),
  },
  {
    _id: "2",
    orderId: "ORD-002",
    customerId: "2",
    customerName: "Jane Smith",
    items: [
      {
        productId: "2",
        productName: "Chaunsa Mangoes",
        quantity: 1,
        unit: "Kg",
        price: 250,
        total: 250,
      },
    ],
    totalAmount: 237.5,
    status: "processing",
    shippingAddress: {
      streetAddress: "456 Oak Ave",
      houseNo: "10",
      town: "Uptown",
      city: "Karachi",
      country: "Pakistan",
      postalCode: "75000",
    },
    paymentMethod: "cash",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

const mockShipments: Shipment[] = [
  {
    _id: "1",
    shipmentId: "SHIP-001",
    orderId: "ORD-001",
    customerName: "John Doe",
    customerAddress: {
      streetAddress: "123 Main St",
      houseNo: "Apt 4B",
      town: "Downtown",
      city: "Lahore",
      country: "Pakistan",
      postalCode: "54000",
    },
    status: "in_transit",
    expectedDeliveryDate: new Date(Date.now() + 7 * 86400000).toISOString(),
    trackingNumber: "TRACK123456",
    carrier: "LocalHarvest Express",
    createdAt: new Date().toISOString(),
  },
  {
    _id: "2",
    shipmentId: "SHIP-002",
    orderId: "ORD-002",
    customerName: "Jane Smith",
    customerAddress: {
      streetAddress: "456 Oak Ave",
      houseNo: "10",
      town: "Uptown",
      city: "Karachi",
      country: "Pakistan",
      postalCode: "75000",
    },
    status: "preparing",
    expectedDeliveryDate: new Date(Date.now() + 7 * 86400000).toISOString(),
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

const FarmerDashboard: React.FC = () => {
  const farmer = useAppSelector((state) => state.auth.farmer);
  const [activeView, setActiveView] = useState<DashboardView>("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const logoutMutation = useLogoutFarmer();

  // Get products for stats
  const { data: products = [] } = useGetMyProducts();

  // Compute stats from products and mock data
  const stats = useMemo(() => {
    const totalProducts = products.length;
    const totalOrders = mockOrders.length;
    const pendingShipments = mockShipments.filter(
      (s) => s.status !== "delivered" && s.status !== "cancelled"
    ).length;
    const totalCustomers = mockCustomers.length;

    return {
      totalProducts,
      totalOrders,
      pendingShipments,
      totalCustomers,
    };
  }, [products]);

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
              />
            )}

            {activeView === "products" && <ProductsSection />}

            {activeView === "customers" && (
              <CustomersSection customers={mockCustomers} />
            )}

            {activeView === "orders" && <OrdersSection orders={mockOrders} />}

            {activeView === "shipments" && (
              <ShipmentsSection shipments={mockShipments} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default FarmerDashboard;
