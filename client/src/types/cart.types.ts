export interface CartItem {
  id: string;
  name: string;
  image?: string;
  price: number;
  quantity: number;
  unit: string; // "Kg", "Bunch", etc.
  category?: string;
}

export interface CartState {
  items: CartItem[];
  discount: number; // Percentage discount (e.g., 5 for 5%)
  promoCode?: string;
  freeDeliveryThreshold: number; // Minimum amount for free delivery
}

