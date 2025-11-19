import React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import Container from "@/components/container/Container";
import { useSearchProducts } from "@/hooks/useProducts";
import ProductGridCard from "@/components/products/ProductGridCard";
import { Search, Loader2 } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { selectCartItemCount } from "@/store/slices/cartSlice";
import { useAddToCart } from "@/hooks/useCart";
import { toast } from "react-toastify";

const SearchResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const cartItemCount = useAppSelector(selectCartItemCount);
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { data: products, isLoading, error } = useSearchProducts(query);
  const addToCart = useAddToCart();

  const handleLogoClick = () => {
    navigate("/");
  };

  const handleAccountClick = () => {
    navigate("/login");
  };

  const handleCartClick = () => {
    navigate("/cart");
  };

  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleAddToCart = (productId: string) => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
      navigate("/login", { state: { from: window.location.pathname } });
      return;
    }

    if (!productId) {
      toast.error("Invalid product");
      return;
    }

    addToCart.mutate(
      { productId, quantity: 1 },
      {
        onSuccess: () => {
          // Success message is handled by the hook
        },
        onError: (error: any) => {
          // Error message is handled by the hook
          console.error("Add to cart error:", error);
        },
      }
    );
  };

  return (
    <div className="w-full flex flex-col min-h-screen bg-gray-50">
      <Header
        cartCount={cartItemCount}
        onAccountClick={handleAccountClick}
        onCartClick={handleCartClick}
        onLogoClick={handleLogoClick}
        onSearch={handleSearch}
      />
      <main className="flex-1 py-8 sm:py-12">
        <Container>
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              Search Results
            </h1>
            {query && (
              <p className="text-base sm:text-lg text-gray-600">
                {isLoading ? (
                  "Searching..."
                ) : products && Array.isArray(products) ? (
                  <>
                    Found <span className="font-semibold">{products.length}</span>{" "}
                    {products.length === 1 ? "product" : "products"} for{" "}
                    <span className="font-semibold">"{query}"</span>
                  </>
                ) : (
                  `Searching for "${query}"`
                )}
              </p>
            )}
          </div>

          {!query ? (
            <div className="flex flex-col items-center justify-center py-16 sm:py-24">
              <Search className="h-16 w-16 sm:h-24 sm:w-24 text-gray-400 mb-4" />
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
                Start Your Search
              </h2>
              <p className="text-gray-600 mb-6 text-center px-4">
                Enter a search term in the search bar above to find products
              </p>
            </div>
          ) : isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 sm:py-24">
              <Loader2 className="h-12 w-12 text-green-600 animate-spin mb-4" />
              <p className="text-gray-600">Searching products...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-16 sm:py-24">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
                <h3 className="text-lg font-semibold text-red-900 mb-2">
                  Error Searching Products
                </h3>
                <p className="text-red-700">
                  {error instanceof Error ? error.message : "An error occurred while searching. Please try again."}
                </p>
              </div>
            </div>
          ) : products && Array.isArray(products) && products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {products.map((product) => (
                <ProductGridCard
                  key={product._id}
                  product={{
                    ...product,
                    sellerName: product.sellerName || product.farmer?.farmName || "Unknown Farmer",
                    rating: product.rating || 4.5,
                  }}
                  onAddToCart={() => handleAddToCart(product._id)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 sm:py-24">
              <Search className="h-16 w-16 sm:h-24 sm:w-24 text-gray-400 mb-4" />
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
                No Products Found
              </h2>
              <p className="text-gray-600 mb-6 text-center px-4">
                We couldn't find any products matching <span className="font-semibold">"{query}"</span>
              </p>
              <p className="text-sm text-gray-500 text-center px-4">
                Try different keywords or browse our categories
              </p>
            </div>
          )}
        </Container>
      </main>
      <Footer />
    </div>
  );
};

export default SearchResultsPage;

