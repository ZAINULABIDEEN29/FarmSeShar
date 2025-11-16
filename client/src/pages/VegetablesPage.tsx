import React, { useState, useMemo } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Breadcrumbs } from "@/components/products";
import FilterSidebar from "@/components/products/FilterSidebar";
import ProductGridCard from "@/components/products/ProductGridCard";
import Pagination from "@/components/products/Pagination";
import Container from "@/components/container/Container";
import { useAppSelector } from "@/store/hooks";
import { selectCartItemCount } from "@/store/slices/cartSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// Mock data - Replace with API call later
// Using placeholder images - Replace with actual farmer image URLs from API
const mockProducts = [
  { _id: "1", name: "Fresh Potatoes", price: 80, unit: "Kg", sellerName: "Ali Ahmad", farmerImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=AliAhmad", location: "Lahore, Punjab", rating: 4.5 },
  { _id: "2", name: "Local Onions", price: 50, unit: "Kg", sellerName: "Muhammad Islam", farmerImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=MuhammadIslam", location: "Faisalabad, Punjab", rating: 4.3 },
  { _id: "3", name: "Organic Tomatoes", price: 120, unit: "Kg", sellerName: "Hassan Ali", farmerImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=HassanAli", location: "Multan, Punjab", rating: 4.8 },
  { _id: "4", name: "Fresh Spinach", price: 60, unit: "Kg", sellerName: "Ahmed Khan", farmerImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=AhmedKhan", location: "Rawalpindi, Punjab", rating: 4.6 },
  { _id: "5", name: "Organic Cauliflower", price: 90, unit: "Kg", sellerName: "Zain Malik", farmerImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=ZainMalik", location: "Sargodha, Punjab", rating: 4.4 },
  { _id: "6", name: "Crisp Cabbage", price: 45, unit: "Kg", sellerName: "Bilal Hassan", farmerImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=BilalHassan", location: "Gujranwala, Punjab", rating: 4.7 },
  { _id: "7", name: "Fresh Carrots", price: 70, unit: "Kg", sellerName: "Riaz Hussain", farmerImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=RiazHussain", location: "Nokot, Mansehra", rating: 4.9 },
  { _id: "8", name: "Organic Eggplant", price: 100, unit: "Kg", sellerName: "Saad Ali", farmerImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=SaadAli", location: "Sheikhupura, Punjab", rating: 4.2 },
  { _id: "9", name: "Fresh Okra", price: 85, unit: "Kg", sellerName: "Taha Ahmed", farmerImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=TahaAhmed", location: "Sialkot, Punjab", rating: 4.6 },
  { _id: "10", name: "Sweet Green Peas", price: 150, unit: "Kg", sellerName: "Hamza Khan", farmerImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=HamzaKhan", location: "Jhang, Punjab", rating: 4.9 },
  { _id: "11", name: "Organic Bitter Gourd", price: 95, unit: "Kg", sellerName: "Faisal Ali", farmerImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=FaisalAli", location: "Sahiwal, Punjab", rating: 4.3 },
  { _id: "12", name: "Fresh Capsicum", price: 110, unit: "Kg", sellerName: "Yousuf Malik", farmerImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=YousufMalik", location: "Bahawalpur, Punjab", rating: 4.7 },
  { _id: "13", name: "Fresh Cucumber", price: 65, unit: "Kg", sellerName: "Ali Ahmad", farmerImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=AliAhmad2", location: "Lahore, Punjab", rating: 4.4 },
  { _id: "14", name: "Local Garlic", price: 200, unit: "Kg", sellerName: "Muhammad Islam", farmerImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=MuhammadIslam2", location: "Faisalabad, Punjab", rating: 4.6 },
  { _id: "15", name: "Organic Bell Peppers", price: 130, unit: "Kg", sellerName: "Hassan Ali", farmerImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=HassanAli2", location: "Multan, Punjab", rating: 4.8 },
  { _id: "16", name: "Fresh Broccoli", price: 140, unit: "Kg", sellerName: "Ahmed Khan", farmerImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=AhmedKhan2", location: "Rawalpindi, Punjab", rating: 4.7 },
  { _id: "17", name: "Organic Lettuce", price: 75, unit: "Kg", sellerName: "Zain Malik", farmerImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=ZainMalik2", location: "Sargodha, Punjab", rating: 4.5 },
  { _id: "18", name: "Fresh Radish", price: 55, unit: "Kg", sellerName: "Bilal Hassan", farmerImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=BilalHassan2", location: "Gujranwala, Punjab", rating: 4.3 },
  { _id: "19", name: "Local Ginger", price: 180, unit: "Kg", sellerName: "Umar Farooq", farmerImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=UmarFarooq2", location: "Kasur, Punjab", rating: 4.6 },
  { _id: "20", name: "Organic Corn", price: 90, unit: "Kg", sellerName: "Saad Ali", farmerImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=SaadAli2", location: "Sheikhupura, Punjab", rating: 4.9 },
  { _id: "21", name: "Fresh Zucchini", price: 85, unit: "Kg", sellerName: "Taha Ahmed", farmerImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=TahaAhmed2", location: "Sialkot, Punjab", rating: 4.5 },
  { _id: "22", name: "Organic Mushrooms", price: 160, unit: "Kg", sellerName: "Hamza Khan", farmerImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=HamzaKhan2", location: "Jhang, Punjab", rating: 4.7 },
  { _id: "23", name: "Fresh Asparagus", price: 220, unit: "Kg", sellerName: "Faisal Ali", farmerImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=FaisalAli2", location: "Sahiwal, Punjab", rating: 4.8 },
  { _id: "24", name: "Organic Kale", price: 95, unit: "Kg", sellerName: "Yousuf Malik", farmerImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=YousufMalik2", location: "Bahawalpur, Punjab", rating: 4.4 },
  { _id: "25", name: "Fresh Beetroot", price: 70, unit: "Kg", sellerName: "Ali Ahmad", farmerImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=AliAhmad3", location: "Lahore, Punjab", rating: 4.6 },
  { _id: "26", name: "Local Turnip", price: 50, unit: "Kg", sellerName: "Muhammad Islam", farmerImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=MuhammadIslam3", location: "Faisalabad, Punjab", rating: 4.3 },
  { _id: "27", name: "Organic Leeks", price: 105, unit: "Kg", sellerName: "Hassan Ali", farmerImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=HassanAli3", location: "Multan, Punjab", rating: 4.7 },
  { _id: "28", name: "Fresh Celery", price: 80, unit: "Kg", sellerName: "Ahmed Khan", farmerImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=AhmedKhan3", location: "Rawalpindi, Punjab", rating: 4.5 },
  { _id: "29", name: "Organic Brussel Sprouts", price: 175, unit: "Kg", sellerName: "Zain Malik", farmerImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=ZainMalik3", location: "Sargodha, Punjab", rating: 4.8 },
  { _id: "30", name: "Fresh Artichoke", price: 250, unit: "Kg", sellerName: "Bilal Hassan", farmerImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=BilalHassan3", location: "Gujranwala, Punjab", rating: 4.9 },
];

const VegetablesPage: React.FC = () => {
  const navigate = useNavigate();
  const cartItemCount = useAppSelector(selectCartItemCount);
  const [sortBy, setSortBy] = useState("Name A-Z");
  const [category, setCategory] = useState("All Categories");
  const [priceRange, setPriceRange] = useState("Any Price");
  const [quickFilters, setQuickFilters] = useState<string[]>(["Organic Only", "In Stock"]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const handleAccountClick = () => {
    navigate("/login");
  };

  const handleCartClick = () => {
    navigate("/cart");
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  const handleAddToCart = (productId: string) => {
    toast.success("Product added to cart!");
    // TODO: Add to cart logic
  };

  const handlePriceRangeChange = (range: string) => {
    setPriceRange(range);
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handleQuickFilterToggle = (filter: string) => {
    setQuickFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );
    setCurrentPage(1); // Reset to first page on filter change
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let products = [...mockProducts];

    // Filter by price range
    if (priceRange !== "Any Price") {
      if (priceRange === "Rs. 0 - Rs. 50") {
        products = products.filter((p) => p.price >= 0 && p.price <= 50);
      } else if (priceRange === "Rs. 50 - Rs. 100") {
        products = products.filter((p) => p.price >= 50 && p.price <= 100);
      } else if (priceRange === "Rs. 100 - Rs. 200") {
        products = products.filter((p) => p.price >= 100 && p.price <= 200);
      } else if (priceRange === "Rs. 200+") {
        products = products.filter((p) => p.price >= 200);
      }
    }

    // Filter by category
    if (category !== "All Categories") {
      // For now, all products are vegetables, so we'll keep them all
      // This can be extended when we have different categories
    }

    // Filter by quick filters
    if (quickFilters.includes("Organic Only")) {
      // Filter organic products (products with "Organic" in name)
      products = products.filter((p) => p.name.toLowerCase().includes("organic"));
    }

    // Sort products
    switch (sortBy) {
      case "Name A-Z":
        products.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "Name Z-A":
        products.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "Price: Low to High":
        products.sort((a, b) => a.price - b.price);
        break;
      case "Price: High to Low":
        products.sort((a, b) => b.price - a.price);
        break;
      case "Popularity":
        products.sort((a, b) => b.rating - a.rating);
        break;
      case "Newest":
        // Since we're using mock data, we'll keep original order
        break;
      default:
        products.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return products;
  }, [sortBy, category, priceRange, quickFilters]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header
        cartCount={cartItemCount}
        onAccountClick={handleAccountClick}
        onCartClick={handleCartClick}
        onLogoClick={handleLogoClick}
      />

      <main className="flex-1 w-full py-6 sm:py-8 lg:py-10">
        <Container>
          {/* Breadcrumbs */}
          <Breadcrumbs />

          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 mt-6 relative">
            {/* Left Sidebar - Filters */}
            <div className="lg:w-64 xl:w-72 shrink-0 relative z-0">
              <FilterSidebar
                sortBy={sortBy}
                onSortChange={setSortBy}
                category={category}
                onCategoryChange={setCategory}
                priceRange={priceRange}
                onPriceRangeChange={handlePriceRangeChange}
                quickFilters={["Organic Only", "In Stock"]}
                activeQuickFilters={quickFilters}
                onQuickFilterToggle={handleQuickFilterToggle}
              />
            </div>

            {/* Main Content Area */}
            <div className="flex-1">
              {/* Header with title and product count */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-0">
                  Vegetables
                </h1>
                <p className="text-sm sm:text-base text-gray-600">
                  Showing {startIndex + 1} - {Math.min(endIndex, filteredProducts.length)} of {filteredProducts.length} Products
                </p>
              </div>

              {/* Product Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {currentProducts.map((product) => (
                  <ProductGridCard
                    key={product._id}
                    product={product}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              )}
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
};

export default VegetablesPage;

