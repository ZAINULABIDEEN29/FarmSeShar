import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { User } from "@/types/user.types";
import type { Farmer } from "@/types/farmer.types";
interface AuthState {
  user: User | null;
  farmer: Farmer | null;
  isAuthenticated: boolean;
  userType: "user" | "farmer" | null;
  isRestoring: boolean;
}
const initialState: AuthState = {
  user: null,
  farmer: null,
  isAuthenticated: false,
  userType: null,
  isRestoring: true,
};
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.farmer = null;
      state.isAuthenticated = true;
      state.userType = "user";
      state.isRestoring = false;
    },
    setFarmer: (state, action: PayloadAction<Farmer>) => {
      state.farmer = action.payload;
      state.user = null;
      state.isAuthenticated = true;
      state.userType = "farmer";
      state.isRestoring = false;
    },
    setRestoring: (state, action: PayloadAction<boolean>) => {
      state.isRestoring = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.farmer = null;
      state.isAuthenticated = false;
      state.userType = null;
      state.isRestoring = false;
    },
    clearAuth: (state) => {
      state.user = null;
      state.farmer = null;
      state.isAuthenticated = false;
      state.userType = null;
      state.isRestoring = false;
    },
  },
});
export const { setUser, setFarmer, setRestoring, logout, clearAuth } = authSlice.actions;
export default authSlice.reducer;
