import React from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import Container from "@/components/container/Container";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, Search } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";
import { selectCartItemCount } from "@/store/slices/cartSlice";
const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const cartItemCount = useAppSelector(selectCartItemCount);
  const handleGoHome = () => {
    navigate("/");
  };
  const handleGoBack = () => {
    navigate(-1);
  };
  const handleAccountClick = () => {
    navigate("/login");
  };
  const handleCartClick = () => {
    navigate("/cart");
  };
  const handleLogoClick = () => {
    navigate("/");
  };
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header
        cartCount={cartItemCount}
        onAccountClick={handleAccountClick}
        onCartClick={handleCartClick}
        onLogoClick={handleLogoClick}
      />
      <main className="flex-1 w-full py-16 sm:py-20 lg:py-16 xl:py-16">
        <Container>
          <div className="max-w-2xl mx-auto text-center px-4 sm:px-6">
            {}
            <div className="mb-8 sm:mb-10">
              <h1 className="text-8xl sm:text-9xl lg:text-[12rem] font-bold text-gray-200 leading-none">
                404
              </h1>
            </div>
            {}
            <div className="mx-auto flex items-center justify-center h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-green-100 mb-6 sm:mb-8">
              <Search className="h-10 w-10 sm:h-12 sm:w-12 text-green-600" />
            </div>
            {}
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
              Page Not Found
            </h2>
            {}
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-6 sm:mb-8 max-w-xl mx-auto leading-relaxed">
              Sorry, the page you're looking for doesn't exist or has been moved. 
              The URL <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">{location.pathname}</span> could not be found.
            </p>
            {}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
              <Button
                onClick={handleGoHome}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 text-base sm:text-lg rounded-lg transition-colors flex items-center justify-center gap-2 min-w-[160px]"
              >
                <Home className="h-5 w-5" />
                Go Home
              </Button>
              <Button
                onClick={handleGoBack}
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-green-500 font-semibold px-8 py-3 text-base sm:text-lg rounded-lg transition-colors flex items-center justify-center gap-2 min-w-[160px]"
              >
                <ArrowLeft className="h-5 w-5" />
                Go Back
              </Button>
            </div>
            {}
            <div className="mt-12 sm:mt-16 pt-8 sm:pt-12 border-t border-gray-200">
              <p className="text-sm sm:text-base font-semibold text-gray-900 mb-4 sm:mb-6">
                You might be looking for:
              </p>
              <div className="flex flex-wrap gap-3 sm:gap-4 justify-center">
                <Button
                  onClick={() => navigate("/vegetables")}
                  variant="outline"
                  className="border-green-300 text-green-700 hover:bg-green-50 hover:border-green-500 text-sm sm:text-base px-4 py-2 rounded-lg transition-colors"
                >
                  Vegetables
                </Button>
                <Button
                  onClick={() => navigate("/fruits")}
                  variant="outline"
                  className="border-green-300 text-green-700 hover:bg-green-50 hover:border-green-500 text-sm sm:text-base px-4 py-2 rounded-lg transition-colors"
                >
                  Fruits
                </Button>
                <Button
                  onClick={() => navigate("/dairy")}
                  variant="outline"
                  className="border-green-300 text-green-700 hover:bg-green-50 hover:border-green-500 text-sm sm:text-base px-4 py-2 rounded-lg transition-colors"
                >
                  Dairy
                </Button>
                <Button
                  onClick={() => navigate("/herbs")}
                  variant="outline"
                  className="border-green-300 text-green-700 hover:bg-green-50 hover:border-green-500 text-sm sm:text-base px-4 py-2 rounded-lg transition-colors"
                >
                  Herbs
                </Button>
                <Button
                  onClick={() => navigate("/about")}
                  variant="outline"
                  className="border-green-300 text-green-700 hover:bg-green-50 hover:border-green-500 text-sm sm:text-base px-4 py-2 rounded-lg transition-colors"
                >
                  About
                </Button>
                <Button
                  onClick={() => navigate("/contact")}
                  variant="outline"
                  className="border-green-300 text-green-700 hover:bg-green-50 hover:border-green-500 text-sm sm:text-base px-4 py-2 rounded-lg transition-colors"
                >
                  Contact
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
};
export default NotFoundPage;
