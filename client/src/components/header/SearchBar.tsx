import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  onSearch?: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Search products...",
  className,
  inputClassName,
  onSearch,
}) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchValue = formData.get("search") as string;
    onSearch?.(searchValue);
  };

  return (
    <form onSubmit={handleSubmit} className={cn("relative", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        <Input
          name="search"
          type="search"
          placeholder={placeholder}
          className={cn(
            "w-full pl-9 pr-4 h-10 md:h-11 rounded-full border-gray-200 bg-gray-50 focus:bg-white focus:border-gray-300 transition-colors",
            inputClassName
          )}
        />
      </div>
    </form>
  );
};

export default SearchBar;

