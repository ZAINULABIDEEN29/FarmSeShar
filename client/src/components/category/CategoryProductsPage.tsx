import React from "react";
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
import { useCategoryProducts } from "@/hooks/useCategoryProducts";
import { useCategoryPage } from "@/hooks/useCategoryPage";
import { useAddToCart } from "@/hooks/useCart";
interface CategoryProductsPageProps {
  categoryName: string;
  itemsPerPage?: number;
}
const CategoryProductsPage: React.FC<CategoryProductsPageProps> = ({
  categoryName,
  itemsPerPage = 12,
}) => {
  const navigate = useNavigate();
  const cartItemCount = useAppSelector(selectCartItemCount);
  const {
    products,
    isLoading,
    error,
    isEmpty,
    LoaderComponent,
    ErrorComponent,
    EmptyComponent,
  } = useCategoryProducts({ category: categoryName, itemsPerPage });
  const {
    sortBy,
    setSortBy,
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
  } = useCategoryPage({ 
    products: products as any, 
    itemsPerPage 
  });
  const handleAccountClick = () => {
    navigate("/login");
  };
  const handleCartClick = () => {
    navigate("/cart");
  };
  const handleLogoClick = () => {
    navigate("/");
  };
  const addToCart = useAddToCart();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const handleAddToCart = (productId: string) => {
    if (!productId) {
      toast.error("Invalid product. Please try again.");
      console.error("Add to cart called with invalid productId:", productId);
      return;
    }
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
      navigate("/login", { state: { from: window.location.pathname } });
      return;
    }
    addToCart.mutate(
      { productId: String(productId), quantity: 1 },
      {
        onSuccess: () => {
        },
        onError: (error: any) => {
          console.error("Add to cart mutation error:", error);
        },
      }
    );
  };
  const handlePriceRangeChange = (range: string) => {
    setPriceRange(range);
    setCurrentPage(1);
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
          <Breadcrumbs currentPage={categoryName} />
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 mt-6 relative">
            <div className="lg:w-64 xl:w-72 shrink-0 relative z-0">
              <FilterSidebar
                sortBy={sortBy}
                onSortChange={setSortBy}
                category="All Categories"
                onCategoryChange={() => {}}
                priceRange={priceRange}
                onPriceRangeChange={handlePriceRangeChange}
                quickFilters={["Organic Only", "In Stock"]}
                activeQuickFilters={quickFilters}
                onQuickFilterToggle={toggleQuickFilter}
              />
            </div>
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-0">
                  {categoryName}
                </h1>
                {!isLoading && !error && (
                  <p className="text-sm sm:text-base text-gray-600">
                    Showing {startIndex + 1} - {Math.min(endIndex, totalProducts)} of {totalProducts} Products
                  </p>
                )}
              </div>
              {isLoading ? (
                LoaderComponent
              ) : error ? (
                ErrorComponent
              ) : isEmpty ? (
                EmptyComponent
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {currentProducts.map((product) => {
                      if (!product._id) {
                        console.error("Product missing _id:", product);
                        return null;
                      }
                      return (
                        <ProductGridCard
                          key={product._id}
                          product={product as any}
                          onAddToCart={handleAddToCart}
                        />
                      );
                    })}
                  </div>
                  {totalPages > 1 && (
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                    />
                  )}
                </>
              )}
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
};
export default CategoryProductsPage;
