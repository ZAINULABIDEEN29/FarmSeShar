import React from "react";
import { ChevronRight, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
interface BreadcrumbsProps {
  items?: Array<{ label: string; path?: string }>;
  currentPage?: string;
}
const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ 
  items = [{ label: "Home", path: "/" }],
  currentPage = "Vegetables"
}) => {
  const navigate = useNavigate();
  return (
    <nav className="flex items-center gap-2 text-sm sm:text-base text-gray-600 mb-4">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index === 0 && item.label === "Home" ? (
            <button
              onClick={() => item.path && navigate(item.path)}
              className="flex items-center gap-1 hover:text-green-600 transition-colors"
            >
              <Home className="h-4 w-4" />
              {item.label}
            </button>
          ) : (
            <button
              onClick={() => item.path && navigate(item.path)}
              className="hover:text-green-600 transition-colors"
            >
              {item.label}
            </button>
          )}
          {index < items.length && (
            <ChevronRight className="h-4 w-4 text-gray-400" />
          )}
        </React.Fragment>
      ))}
      <span className="text-gray-900 font-medium">{currentPage}</span>
    </nav>
  );
};
export default Breadcrumbs;
