import { useState, useMemo, useCallback } from "react";

export interface Product {
  _id: string;
  name: string;
  price: number;
  unit: string;
  image?: string;
  sellerName: string;
  farmerImage?: string;
  location?: string;
  rating: number;
}

interface UseCategoryPageOptions {
  products: Product[];
  itemsPerPage?: number;
}

interface UseCategoryPageReturn {
  sortBy: string;
  setSortBy: (value: string) => void;
  category: string;
  setCategory: (value: string) => void;
  priceRange: string;
  setPriceRange: (value: string) => void;
  quickFilters: string[];
  toggleQuickFilter: (filter: string) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  filteredProducts: Product[];
  totalPages: number;
  currentProducts: Product[];
  startIndex: number;
  endIndex: number;
  totalProducts: number;
}

const PRICE_RANGE_MAP: Record<string, (price: number) => boolean> = {
  "Rs. 0 - Rs. 50": (price) => price >= 0 && price <= 50,
  "Rs. 50 - Rs. 100": (price) => price >= 50 && price <= 100,
  "Rs. 100 - Rs. 200": (price) => price >= 100 && price <= 200,
  "Rs. 200 - Rs. 300": (price) => price >= 200 && price <= 300,
  "Rs. 300 - Rs. 500": (price) => price >= 300 && price <= 500,
  "Rs. 500 - Rs. 750": (price) => price >= 500 && price <= 750,
  "Rs. 750 - Rs. 1000": (price) => price >= 750 && price <= 1000,
  "Rs. 1000+": (price) => price >= 1000,
  "Rs. 200+": (price) => price >= 200,
};

const SORT_FUNCTIONS: Record<string, (a: Product, b: Product) => number> = {
  "Name A-Z": (a, b) => a.name.localeCompare(b.name),
  "Name Z-A": (a, b) => b.name.localeCompare(a.name),
  "Price: Low to High": (a, b) => a.price - b.price,
  "Price: High to Low": (a, b) => b.price - a.price,
  Popularity: (a, b) => (b.rating || 0) - (a.rating || 0),
  Newest: (a, b) => {
    // Sort by createdAt if available, otherwise keep original order
    const dateA = (a as any).createdAt ? new Date((a as any).createdAt).getTime() : 0;
    const dateB = (b as any).createdAt ? new Date((b as any).createdAt).getTime() : 0;
    return dateB - dateA;
  },
};

export const useCategoryPage = ({
  products,
  itemsPerPage = 12,
}: UseCategoryPageOptions): UseCategoryPageReturn => {
  const [sortBy, setSortBy] = useState("Name A-Z");
  const [category, setCategory] = useState("All Categories");
  const [priceRange, setPriceRange] = useState("Any Price");
  const [quickFilters, setQuickFilters] = useState<string[]>([]); // No filters active by default
  const [currentPage, setCurrentPage] = useState(1);

  const toggleQuickFilter = useCallback((filter: string) => {
    setQuickFilters((prev) => {
      const isActive = prev.includes(filter);
      if (isActive) {
        return prev.filter((f) => f !== filter);
      }
      return [...prev, filter];
    });
    setCurrentPage(1);
  }, []);

  const handlePriceRangeChange = useCallback((range: string) => {
    setPriceRange(range);
    setCurrentPage(1);
  }, []);

  const handleCategoryChange = useCallback((cat: string) => {
    setCategory(cat);
    setCurrentPage(1);
  }, []);

  const handleSortChange = useCallback((sort: string) => {
    setSortBy(sort);
    setCurrentPage(1);
  }, []);

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Filter by price range
    if (priceRange !== "Any Price" && PRICE_RANGE_MAP[priceRange]) {
      filtered = filtered.filter((p) => PRICE_RANGE_MAP[priceRange](p.price));
    }

    // Filter by quick filters
    if (quickFilters.includes("Organic Only")) {
      filtered = filtered.filter((p) => p.name.toLowerCase().includes("organic"));
    }

    // Sort products
    const sortFunction = SORT_FUNCTIONS[sortBy] || SORT_FUNCTIONS["Name A-Z"];
    filtered.sort(sortFunction);

    return filtered;
  }, [products, priceRange, quickFilters, sortBy]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  return {
    sortBy,
    setSortBy: handleSortChange,
    category,
    setCategory: handleCategoryChange,
    priceRange,
    setPriceRange: handlePriceRangeChange,
    quickFilters,
    toggleQuickFilter,
    currentPage,
    setCurrentPage,
    filteredProducts,
    totalPages,
    currentProducts,
    startIndex,
    endIndex,
    totalProducts: filteredProducts.length,
  };
};

