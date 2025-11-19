export interface CartItem {
  id: string;
  name: string;
  image?: string;
  price: number;
  quantity: number;
  unit: string;
  category?: string;
}
export interface CartState {
  items: CartItem[];
  discount: number;
  promoCode?: string;
  freeDeliveryThreshold: number;
}
