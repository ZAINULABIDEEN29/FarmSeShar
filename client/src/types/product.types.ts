// Product Types
export interface FarmerInfo {
  _id: string;
  fullName: {
    firstName: string;
    lastName: string;
  };
  farmName: string;
  farmLocation: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  quantity: number;
  unit: string; // kg, piece, box, etc.
  image?: string;
  images?: string[];
  farmerId: string;
  farmer?: FarmerInfo; // Farmer info for public products
  isAvailable: boolean;
  createdAt?: string;
  updatedAt?: string;
  // Legacy fields for compatibility with existing components
  sellerName?: string;
  farmerImage?: string;
  location?: string;
  rating?: number;
}

export interface CreateProductInput {
  name: string;
  description: string;
  price: number;
  category: string;
  quantity: number;
  unit: string;
  image?: string;
  images?: string[];
}

export interface UpdateProductInput extends Partial<CreateProductInput> {
  isAvailable?: boolean;
}

export interface ProductResponse {
  success: boolean;
  message: string;
  product?: Product;
  products?: Product[];
}

export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  isAvailable?: boolean;
  search?: string;
}

