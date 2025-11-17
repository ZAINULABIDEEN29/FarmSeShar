import React, { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import Container from "@/components/container/Container";
import { useAppSelector } from "@/store/hooks";
import { selectCartItemCount } from "@/store/slices/cartSlice";
import { useGetPublicProduct, transformProductForCard, useGetPublicProducts } from "@/hooks/useProducts";
import { useAddToCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import { ChevronRight, Home } from "lucide-react";
import Loader from "@/components/common/Loader";
import { toast } from "react-toastify";
import ProductImageGallery from "@/components/products/ProductImageGallery";
import ProductInfo from "@/components/products/ProductInfo";
import ProductTabs from "@/components/products/ProductTabs";
import RelatedProductsSection from "@/components/products/RelatedProductsSection";

const ProductDetailPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const cartItemCount = useAppSelector(selectCartItemCount);
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  
  const { data: product, isLoading, error } = useGetPublicProduct(productId || "");
  const addToCart = useAddToCart();
  
  const [selectedWeight, setSelectedWeight] = useState("3 Kg");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"details" | "reviews">("details");

  // Get related products (same category, excluding current product)
  const { data: relatedProducts = [] } = useGetPublicProducts({ 
    category: product?.category 
  });

  // Get all products as fallback if no related products in same category
  const { data: allProducts = [] } = useGetPublicProducts({});

  const transformedProduct = useMemo(() => {
    return product ? transformProductForCard(product) : null;
  }, [product]);

  const filteredRelatedProducts = useMemo(() => {
    // First try to get products from same category
    let products = relatedProducts || [];
    
    // If no products in same category or only current product, use all products
    if (products.length === 0 || (products.length === 1 && products[0]._id === productId)) {
      products = allProducts || [];
    }
    
    if (!products || products.length === 0) return [];
    
    return products
      .filter((p) => p._id !== productId)
      .slice(0, 4)
      .map(transformProductForCard);
  }, [relatedProducts, allProducts, productId]);

  // Calculate discount (mock - you can add this to your product model)
  const originalPrice = transformedProduct ? Math.round(transformedProduct.price * 1.43) : 0;
  const discountPercentage = 30;

  const handleAccountClick = () => {
    navigate("/login");
  };

  const handleCartClick = () => {
    navigate("/cart");
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  const handleQuantityInputChange = (value: number) => {
    setQuantity(Math.max(1, value));
  };

  const handleAddToCart = () => {
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
      { productId, quantity },
      {
        onSuccess: () => {
          // Success is handled in the hook
        },
        onError: (error: any) => {
          console.error("Add to cart error:", error);
        },
      }
    );
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.error("Please login to checkout");
      navigate("/login", { state: { from: window.location.pathname } });
      return;
    }

    if (!productId) {
      toast.error("Invalid product");
      return;
    }

    addToCart.mutate(
      { productId, quantity },
      {
        onSuccess: () => {
          navigate("/checkout");
        },
        onError: (error: any) => {
          console.error("Add to cart error:", error);
        },
      }
    );
  };

  const handleRelatedProductAddToCart = (relatedProductId: string) => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
      navigate("/login", { state: { from: window.location.pathname } });
      return;
    }
    addToCart.mutate({ productId: relatedProductId, quantity: 1 });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header
          cartCount={cartItemCount}
          onAccountClick={handleAccountClick}
          onCartClick={handleCartClick}
          onLogoClick={handleLogoClick}
        />
        <div className="flex-1 flex items-center justify-center py-12">
          <Loader />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !product || !transformedProduct) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header
          cartCount={cartItemCount}
          onAccountClick={handleAccountClick}
          onCartClick={handleCartClick}
          onLogoClick={handleLogoClick}
        />
        <div className="flex-1 flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-red-600 mb-4">Product not found</p>
            <Button onClick={() => navigate("/")}>Go Home</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const productImages = product.images && product.images.length > 0 
    ? product.images 
    : product.image 
      ? [product.image] 
      : [];

  // Category-specific content
  const getCategorySpecificContent = (category: string, productName: string) => {
    const categoryLower = category.toLowerCase();
    
    switch (categoryLower) {
      case "fruits":
        return {
          description: product.description || 
            `These ${productName} are freshly picked from local Pakistani orchards, known for their natural sweetness and juicy texture. Carefully selected at peak ripeness, they're perfect for enjoying fresh, making smoothies, desserts, or adding a burst of natural flavor to your meals. Rich in vitamins and nutrients, they're a healthy addition to your daily diet.`,
          type: "Fresh Seasonal Fruit",
          tasteTexture: "Sweet, juicy, and naturally flavorful",
          bestFor: "Fresh eating, smoothies, desserts, juices, and salads",
          shelfLife: "Stays fresh for 3-7 days when refrigerated"
        };
      
      case "dairy":
        return {
          description: product.description || 
            `This ${productName} is freshly produced from local Pakistani dairy farms, ensuring premium quality and natural goodness. Made with traditional methods and care, it's rich in essential nutrients and offers authentic taste. Perfect for daily consumption, cooking, baking, or adding creaminess to your favorite recipes.`,
          type: "Fresh Dairy Product",
          tasteTexture: "Creamy, rich, and naturally fresh",
          bestFor: "Daily consumption, cooking, baking, beverages, and desserts",
          shelfLife: "Stays fresh for 5-7 days when refrigerated"
        };
      
      case "herbs":
        return {
          description: product.description || 
            `These ${productName} are freshly harvested from local Pakistani herb gardens, known for their aromatic fragrance and potent flavor. Carefully handpicked and cleaned, they're perfect for enhancing the taste of your dishes. Whether used fresh or dried, they add authentic flavor and aroma to curries, soups, salads, and traditional recipes.`,
          type: "Fresh Aromatic Herbs",
          tasteTexture: "Aromatic, fresh, and flavorful",
          bestFor: "Curries, soups, salads, garnishing, and traditional dishes",
          shelfLife: "Stays fresh for 3-5 days when refrigerated"
        };
      
      case "vegetables":
      default:
        return {
          description: product.description || 
            `These ${productName} are freshly harvested from local Pakistani farms, known for their natural quality and freshness. Carefully handpicked and cleaned, they're ideal for adding freshness and flavor to your everyday meals. Whether cooked, steamed, or added to various dishes, they blend perfectly into a variety of recipes.`,
          type: "Fresh Seasonal Vegetable",
          tasteTexture: "Sweet, tender, and crisp",
          bestFor: "Curries, pulao, salads, soups, and freezing",
          shelfLife: "Stays fresh for 3-5 days when refrigerated"
        };
    }
  };

  const categoryContent = getCategorySpecificContent(product.category, product.name);
  
  // Enhanced description for product details tab
  const enhancedDescription = categoryContent.description;

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
          <nav className="flex items-center gap-2 text-sm sm:text-base text-gray-600 mb-6">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-1 hover:text-green-600 transition-colors"
            >
              <Home className="h-4 w-4" />
              Home
            </button>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <button
              onClick={() => navigate(`/${product.category.toLowerCase()}`)}
              className="hover:text-green-600 transition-colors"
            >
              {product.category}
            </button>
