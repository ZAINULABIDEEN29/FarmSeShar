import React, { useState } from "react";
import { cn } from "@/lib/utils";
interface ProductImageGalleryProps {
  images: string[];
  productName: string;
}
const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({
  images,
  productName,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  if (!images || images.length === 0) {
    return (
      <div className="space-y-4">
        <div className="relative w-full aspect-square bg-gray-100 rounded-lg border border-gray-200 overflow-hidden flex items-center justify-center">
          <div className="text-gray-400 text-center">
            <p className="text-sm">No images available</p>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      {}
      <div className="relative w-full aspect-square bg-white rounded-lg border border-gray-200 overflow-hidden">
        {images[selectedIndex] ? (
          <img
            src={images[selectedIndex]}
            alt={productName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-50">
            <span className="text-gray-400 text-sm">No image</span>
          </div>
        )}
      </div>
      {}
      {images.length > 1 && (
        <div className="flex flex-col gap-2">
          {images.slice(0, 2).map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={cn(
                "relative w-full h-20 sm:h-24 rounded-lg overflow-hidden transition-all",
                selectedIndex === index
                  ? "border-2 border-green-600 ring-2 ring-green-600 ring-offset-1"
                  : "border border-gray-200 bg-gray-100 hover:bg-gray-200"
              )}
            >
              {selectedIndex === index ? (
                <img
                  src={image}
                  alt={`${productName} ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <span className="text-gray-400 text-xs">No image</span>
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
export default ProductImageGallery;
