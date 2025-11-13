import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { User } from "@/types/user.types";
import type { Farmer } from "@/types/farmer.types";
import { storage, STORAGE_KEYS } from "@/utils/storage";

interface AuthState {
  user: User | null;
  farmer: Farmer | null;
  isAuthenticated: boolean;
  userType: "user" | "farmer" | null;
}

// Load initial state from localStorage
const loadInitialState = (): AuthState => {
  const storedUser = storage.get<User>(STORAGE_KEYS.USER);
  const storedFarmer = storage.get<Farmer>(STORAGE_KEYS.FARMER);

  if (storedUser) {
    return {
      user: storedUser,
      farmer: null,
      isAuthenticated: true,
      userType: "user",
    };
  }

  if (storedFarmer) {
    return {
      user: null,
      farmer: storedFarmer,
      isAuthenticated: true,
      userType: "farmer",
    };
  }

  return {
    user: null,
    farmer: null,
    isAuthenticated: false,
    userType: null,
  };
};

const initialState: AuthState = loadInitialState();

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.farmer = null;
      state.isAuthenticated = true;
      state.userType = "user";
    },
    setFarmer: (state, action: PayloadAction<Farmer>) => {
      state.farmer = action.payload;
      state.user = null;
      state.isAuthenticated = true;
      state.userType = "farmer";
    },
    logout: (state) => {
      state.user = null;
      state.farmer = null;
      state.isAuthenticated = false;
      state.userType = null;
    },
    clearAuth: (state) => {
      state.user = null;
      state.farmer = null;
      state.isAuthenticated = false;
      state.userType = null;
    },
  },
});

export const { setUser, setFarmer, logout, clearAuth } = authSlice.actions;
export default authSlice.reducer;

