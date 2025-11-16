import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 3; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 2; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        pages.push(currentPage - 1, currentPage, currentPage + 1);
        pages.push("...");
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-8 sm:mt-10 lg:mt-12">
      {/* Previous Button */}
      <Button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        variant="outline"
        className={cn(
          "px-4 py-2 text-base border-gray-300 rounded-lg",
          "bg-gray-100 text-gray-900 hover:bg-gray-200 transition-colors",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-100",
          "flex items-center gap-1.5"
        )}
      >
        <ChevronLeft className="h-4 w-4" />
        <span>Previous</span>
      </Button>

      {/* Page Numbers */}
      <div className="flex items-center gap-2">
        {getPageNumbers().map((page, index) => {
          if (page === "...") {
            return (
              <span key={`ellipsis-${index}`} className="px-2 text-base text-gray-700">
                ...
              </span>
            );
          }
          const pageNum = page as number;
          const isActive = pageNum === currentPage;
          return (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={cn(
                "min-w-[32px] h-8 px-3 py-1 text-base font-medium rounded-lg transition-colors",
                isActive
                  ? "bg-gray-200 text-gray-900"
                  : "bg-transparent text-gray-700 hover:text-gray-900"
              )}
            >
              {pageNum}
            </button>
          );
        })}
      </div>

      {/* Next Button */}
      <Button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        variant="outline"
        className={cn(
          "px-4 py-2 text-base border-gray-300 rounded-lg",
          "bg-gray-100 text-gray-900 hover:bg-gray-200 transition-colors",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-100",
          "flex items-center gap-1.5"
        )}
      >
        <span>Next</span>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default Pagination;
