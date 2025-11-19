import React, { useState } from "react";
import { ChevronDown, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
interface FilterSidebarProps {
  sortBy: string;
  onSortChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  priceRange: string;
  onPriceRangeChange: (value: string) => void;
  quickFilters: string[];
  activeQuickFilters: string[];
  onQuickFilterToggle: (filter: string) => void;
}
const FilterSidebar: React.FC<FilterSidebarProps> = ({
  sortBy,
  onSortChange,
  category,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  quickFilters,
  activeQuickFilters,
  onQuickFilterToggle,
}) => {
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isPriceOpen, setIsPriceOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const sortOptions = ["Name A-Z", "Name Z-A", "Price: Low to High", "Price: High to Low", "Newest", "Popularity"];
  const categories = ["All Categories", "Vegetables", "Fruits", "Dairy", "Herbs"];
  const priceRanges = [
    "Any Price", 
    "Rs. 0 - Rs. 50", 
    "Rs. 50 - Rs. 100", 
    "Rs. 100 - Rs. 200", 
    "Rs. 200 - Rs. 300",
    "Rs. 300 - Rs. 500",
    "Rs. 500 - Rs. 750",
    "Rs. 750 - Rs. 1000",
    "Rs. 1000+"
  ];
  const activeFiltersCount = activeQuickFilters.length + 
    (category !== "All Categories" ? 1 : 0) + 
    (sortBy !== "Name A-Z" ? 1 : 0) + 
    (priceRange !== "Any Price" ? 1 : 0);
  React.useEffect(() => {
    if (!isSortOpen && !isCategoryOpen && !isPriceOpen) return;
    const handleClickOutside = () => {
      setIsSortOpen(false);
      setIsCategoryOpen(false);
      setIsPriceOpen(false);
    };
    const timeoutId = setTimeout(() => {
      document.addEventListener("click", handleClickOutside);
    }, 0);
    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isSortOpen, isCategoryOpen, isPriceOpen]);
  return (
    <aside className={cn(
      "w-full lg:w-64 xl:w-72 bg-white rounded-lg shadow-sm border border-gray-100",
      "lg:sticky lg:top-20 lg:h-fit",
      "mb-4 lg:mb-0",
      "overflow-visible"
    )}>
      {}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "w-full flex items-center justify-between",
          "p-4 sm:p-5 lg:hidden",
          "hover:bg-gray-50 transition-colors"
        )}
      >
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-gray-700" />
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">
            Filters
          </h2>
          {activeFiltersCount > 0 && (
            <span className="bg-green-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </div>
        <ChevronDown className={cn(
          "h-5 w-5 text-gray-600 transition-transform",
          isExpanded && "rotate-180"
        )} />
      </button>
      {}
      <div className="hidden lg:flex items-center gap-2 p-4 sm:p-5 lg:p-6 pb-4 lg:pb-6">
        <Filter className="h-5 w-5 text-gray-700" />
        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
          Filters
        </h2>
      </div>
          {}
      <div className={cn(
        "transition-all duration-300 ease-in-out",
        "lg:block",
        isExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0",
        "lg:max-h-none lg:opacity-100",
        "relative overflow-visible"
      )}>
        <div className="px-4 sm:px-5 lg:px-6 pb-4 sm:pb-5 lg:pb-6 pt-0 lg:pt-0 overflow-visible">
          {}
          <div className="mb-4 sm:mb-5 lg:mb-6">
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
              Sort By
            </label>
            <div className="relative z-40">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsSortOpen(!isSortOpen);
                  setIsCategoryOpen(false);
                  setIsPriceOpen(false);
                }}
                className={cn(
                  "w-full flex items-center justify-between",
                  "px-3 sm:px-4 py-2 sm:py-2.5",
                  "border border-gray-300 rounded-lg",
                  "text-sm sm:text-base text-gray-900",
                  "hover:border-green-500 transition-colors",
                  isSortOpen || sortBy !== "Name A-Z"
                    ? "bg-green-50 border-green-300"
                    : "bg-white"
                )}
              >
                <span className="truncate">{sortBy}</span>
                <ChevronDown className={cn(
                  "h-4 w-4 sm:h-5 sm:w-5 text-gray-600 transition-transform shrink-0 ml-2",
                  isSortOpen && "rotate-180"
                )} />
              </button>
              {isSortOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {sortOptions.map((option) => (
                    <button
                      key={option}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSortChange(option);
                        setIsSortOpen(false);
                      }}
                      className={cn(
                        "w-full text-left px-3 sm:px-4 py-2 sm:py-2.5",
                        "text-sm sm:text-base hover:bg-green-50 transition-colors",
                        "first:rounded-t-lg last:rounded-b-lg",
                        sortBy === option ? "text-green-600 font-semibold bg-green-50" : "text-gray-900"
                      )}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          {}
          <div className="mb-4 sm:mb-5 lg:mb-6">
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
              Category
            </label>
            <div className="relative z-30">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsCategoryOpen(!isCategoryOpen);
                  setIsSortOpen(false);
                  setIsPriceOpen(false);
                }}
                className={cn(
                  "w-full flex items-center justify-between",
                  "px-3 sm:px-4 py-2 sm:py-2.5",
                  "border border-gray-300 rounded-lg",
                  "text-sm sm:text-base text-gray-900",
                  "hover:border-green-500 transition-colors",
                  isCategoryOpen || category !== "All Categories"
                    ? "bg-green-50 border-green-300"
                    : "bg-white"
                )}
              >
                <span className="truncate">{category}</span>
                <ChevronDown className={cn(
                  "h-4 w-4 sm:h-5 sm:w-5 text-gray-600 transition-transform shrink-0 ml-2",
                  isCategoryOpen && "rotate-180"
                )} />
              </button>
              {isCategoryOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={(e) => {
                        e.stopPropagation();
                        onCategoryChange(cat);
                        setIsCategoryOpen(false);
                      }}
                      className={cn(
                        "w-full text-left px-3 sm:px-4 py-2 sm:py-2.5",
                        "text-sm sm:text-base hover:bg-green-50 transition-colors",
                        "first:rounded-t-lg last:rounded-b-lg",
                        category === cat ? "text-green-600 font-semibold bg-green-50" : "text-gray-900"
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          {}
          <div className="mb-4 sm:mb-5 lg:mb-6">
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
              Price Range
            </label>
            <div className="relative z-20">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsPriceOpen(!isPriceOpen);
                  setIsSortOpen(false);
                  setIsCategoryOpen(false);
                }}
                className={cn(
                  "w-full flex items-center justify-between",
                  "px-3 sm:px-4 py-2 sm:py-2.5",
                  "border border-gray-300 rounded-lg",
                  "text-sm sm:text-base text-gray-900",
                  "hover:border-green-500 transition-colors",
                  isPriceOpen || priceRange !== "Any Price"
                    ? "bg-green-50 border-green-300"
                    : "bg-white"
                )}
              >
                <span className="truncate">{priceRange}</span>
                <ChevronDown className={cn(
                  "h-4 w-4 sm:h-5 sm:w-5 text-gray-600 transition-transform shrink-0 ml-2",
                  isPriceOpen && "rotate-180"
                )} />
              </button>
              {isPriceOpen && (
                <>
                  <style>{`
                    .price-range-dropdown::-webkit-scrollbar {
                      width: 8px;
                    }
                    .price-range-dropdown::-webkit-scrollbar-track {
                      background: #f3f4f6;
                      border-radius: 4px;
                    }
                    .price-range-dropdown::-webkit-scrollbar-thumb {
                      background: #d1d5db;
                      border-radius: 4px;
                    }
                    .price-range-dropdown::-webkit-scrollbar-thumb:hover {
                      background: #9ca3af;
                    }
                  `}</style>
                  <div 
                    className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto overflow-x-hidden price-range-dropdown"
                    style={{
                      scrollbarWidth: 'thin',
                      scrollbarColor: '#d1d5db #f3f4f6'
                    }}
                  >
                    {priceRanges.map((range) => (
                      <button
                        key={range}
                        onClick={(e) => {
                          e.stopPropagation();
                          onPriceRangeChange(range);
                          setIsPriceOpen(false);
                        }}
                        className={cn(
                          "w-full text-left px-3 sm:px-4 py-2 sm:py-2.5",
                          "text-sm sm:text-base hover:bg-green-50 transition-colors",
                          "first:rounded-t-lg last:rounded-b-lg",
                          "whitespace-nowrap",
                          priceRange === range ? "text-green-600 font-semibold bg-green-50" : "text-gray-900"
                        )}
                      >
                        {range}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
          {}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-3">
              Quick Filters
            </label>
            <div className="flex flex-wrap gap-2">
              {quickFilters.map((filter) => {
                const isActive = activeQuickFilters.includes(filter);
                return (
                  <Button
                    key={filter}
                    onClick={() => onQuickFilterToggle(filter)}
                    variant="outline"
                    className={cn(
                      "text-xs sm:text-sm font-medium",
                      "px-3 sm:px-4 py-1.5 sm:py-2",
                      "rounded-lg transition-colors",
                      isActive
                        ? "bg-green-600 text-white border-green-600 hover:bg-green-700"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-green-50 hover:border-green-500"
                    )}
                  >
                    {filter}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
export default FilterSidebar;
