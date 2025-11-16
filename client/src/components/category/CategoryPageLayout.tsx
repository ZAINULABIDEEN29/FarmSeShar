import React from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Breadcrumbs } from "@/components/products";
import FilterSidebar from "@/components/products/FilterSidebar";
import ProductGridCard from "@/components/products/ProductGridCard";
import Pagination from "@/components/products/Pagination";
import Container from "@/components/container/Container";
import { useCategoryPage, type Product } from "@/hooks/useCategoryPage";
import { useAppSelector } from "@/store/hooks";
import { selectCartItemCount } from "@/store/slices/cartSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface CategoryPageLayoutProps {
  products: Product[];
  categoryName: string;
  itemsPerPage?: number;
}

const CategoryPageLayout: React.FC<CategoryPageLayoutProps> = ({
  products,
  categoryName,
  itemsPerPage = 12,
}) => {
  const navigate = useNavigate();
  const cartItemCount = useAppSelector(selectCartItemCount);

  const {
    sortBy,
    setSortBy,
    category,
    setCategory,
    priceRange,
    setPriceRange,
    quickFilters,
    toggleQuickFilter,
    currentPage,
    setCurrentPage,
    totalPages,
    currentProducts,
    startIndex,
    endIndex,
    totalProducts,
  } = useCategoryPage({ products, itemsPerPage });

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
          <Breadcrumbs currentPage={categoryName} />

          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 mt-6 relative">
            {/* Left Sidebar - Filters */}
            <div className="lg:w-64 xl:w-72 shrink-0 relative z-0">
              <FilterSidebar
                sortBy={sortBy}
                onSortChange={setSortBy}
                category={category}
                onCategoryChange={setCategory}
                priceRange={priceRange}
                onPriceRangeChange={setPriceRange}
                quickFilters={["Organic Only", "In Stock"]}
                activeQuickFilters={quickFilters}
                onQuickFilterToggle={toggleQuickFilter}
              />
            </div>

            {/* Main Content Area */}
            <div className="flex-1">
              {/* Header with title and product count */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-0">
                  {categoryName}
                </h1>
                <p className="text-sm sm:text-base text-gray-600">
                  Showing {startIndex + 1} - {Math.min(endIndex, totalProducts)} of {totalProducts} Products
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

export default CategoryPageLayout;

