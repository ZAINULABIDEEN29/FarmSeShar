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
  unit: string;
  image?: string;
  images?: string[];
  farmerId: string;
  farmer?: FarmerInfo;
  isAvailable: boolean;
  createdAt?: string;
  updatedAt?: string;
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
  images: string[];
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
