import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { CartItem, CartState } from "@/types/cart.types";
const initialState: CartState = {
  items: [],
  discount: 5,
  promoCode: undefined,
  freeDeliveryThreshold: 3000,
};
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
    },
    addItem: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ id: string; quantity: number }>
    ) => {
      const item = state.items.find((item) => item.id === action.payload.id);
      if (item) {
        if (action.payload.quantity <= 0) {
          state.items = state.items.filter(
            (item) => item.id !== action.payload.id
          );
        } else {
          item.quantity = action.payload.quantity;
        }
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.promoCode = undefined;
    },
    applyPromoCode: (state, action: PayloadAction<string>) => {
      state.promoCode = action.payload;
    },
    removePromoCode: (state) => {
      state.promoCode = undefined;
    },
    setDiscount: (state, action: PayloadAction<number>) => {
      state.discount = action.payload;
    },
  },
});
export const {
  setCart,
  addItem,
  removeItem,
  updateQuantity,
  clearCart,
  applyPromoCode,
  removePromoCode,
  setDiscount,
} = cartSlice.actions;
export const selectCartItems = (state: { cart: CartState }) => state.cart.items;
export const selectCartTotal = (state: { cart: CartState }) => {
  const subtotal = state.cart.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const discountAmount = (subtotal * state.cart.discount) / 100;
  const deliveryFee =
    subtotal >= state.cart.freeDeliveryThreshold ? 0 : 0;
  return {
    subtotal,
    discount: discountAmount,
    deliveryFee,
    total: subtotal - discountAmount + deliveryFee,
  };
};
export const selectCartItemCount = (state: { cart: CartState }) =>
  state.cart.items.reduce((total, item) => total + item.quantity, 0);
export default cartSlice.reducer;
