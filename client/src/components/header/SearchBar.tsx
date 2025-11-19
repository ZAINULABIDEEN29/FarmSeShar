import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Search, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useSearchProducts } from "@/hooks/useProducts";

interface SearchBarProps {
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  onSearch?: (value: string) => void;
  showSuggestions?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Search products...",
  className,
  inputClassName,
  onSearch,
  showSuggestions = true,
}) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [isFocused, setIsFocused] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

 
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [searchQuery]);


  const { data: searchResults, isLoading: isSearching } = useSearchProducts(
    debouncedQuery.trim().length > 0 ? debouncedQuery : ""
  );

 
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (query) {
      if (onSearch) {
        onSearch(query);
      } else {
        navigate(`/search?q=${encodeURIComponent(query)}`);
      }
      setIsFocused(false);
      inputRef.current?.blur();
    }
  };

  const handleClear = () => {
    setSearchQuery("");
    setDebouncedQuery("");
    inputRef.current?.focus();
    if (onSearch) {
      onSearch("");
    }
  };

  const handleSuggestionClick = (query: string) => {
    setSearchQuery(query);
    setDebouncedQuery(query);
    if (onSearch) {
      onSearch(query);
    } else {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
    setIsFocused(false);
    inputRef.current?.blur();
  };

  const showSuggestionsDropdown =
    showSuggestions &&
    isFocused &&
    debouncedQuery.trim().length > 0 &&
    searchResults &&
    searchResults.length > 0;

  return (
    <div ref={searchRef} className={cn("relative", className)}>
      <form onSubmit={handleSubmit} className="relative w-full">
        <div className="relative w-full">
          <Search className="absolute left-3 md:left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 md:h-[18px] md:w-[18px] text-gray-400 pointer-events-none z-10" />
          <Input
            ref={inputRef}
            name="search"
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            onFocus={() => setIsFocused(true)}
            placeholder={placeholder}
            className={cn(
              "w-full pl-9 md:pl-10 pr-20 md:pr-20 h-10 md:h-11 rounded-full border-gray-200 bg-gray-50 focus:bg-white focus:border-gray-300 transition-colors text-sm md:text-base",
              "[&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden",
              inputClassName
            )}
            autoComplete="off"
          />
          {searchQuery && !isSearching && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 md:right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 transition-colors z-10"
              aria-label="Clear search"
            >
              <X className="h-4 w-4 md:h-[18px] md:w-[18px] text-gray-400 hover:text-gray-500" />
            </button>
          )}
          {isSearching && (
            <div className="absolute right-3 md:right-3.5 top-1/2 -translate-y-1/2 z-10">
              <Loader2 className="h-4 w-4 md:h-[18px] md:w-[18px] text-gray-400 animate-spin" />
            </div>
          )}
        </div>
      </form>

     
      {showSuggestionsDropdown && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-'9999' max-h-96 overflow-y-auto">
          <div className="p-2">
            <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">
              Products ({searchResults.length})
            </div>
            <div className="divide-y divide-gray-100">
              {searchResults.slice(0, 5).map((product) => (
                <button
                  key={product._id}
                  type="button"
                  onClick={() => handleSuggestionClick(product.name)}
                  className="w-full px-3 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3"
                >
                  {product.images?.[0] || product.image ? (
                    <img
                      src={product.images?.[0] || product.image}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded-md"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center">
                      <span className="text-xs text-gray-500">No img</span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {product.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {product.category} • Rs. {product.price}/{product.unit}
                    </p>
                  </div>
                </button>
              ))}
            </div>
            {searchResults.length > 5 && (
              <button
                type="button"
                onClick={() => handleSuggestionClick(debouncedQuery)}
                className="w-full px-3 py-2 mt-2 text-sm font-medium text-green-600 hover:bg-green-50 rounded-md transition-colors"
              >
                View all {searchResults.length} results
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;

