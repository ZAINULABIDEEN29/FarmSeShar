import { createSlice } from "@reduxjs/toolkit";

interface LoaderState {
  isLoading: boolean;
  loadingCount: number;
}

const initialState: LoaderState = {
  isLoading: false,
  loadingCount: 0,
};

const loaderSlice = createSlice({
  name: "loader",
  initialState,
  reducers: {
    showLoader: (state) => {
      state.loadingCount += 1;
      state.isLoading = true;
    },
    hideLoader: (state) => {
      state.loadingCount = Math.max(0, state.loadingCount - 1);
      if (state.loadingCount === 0) {
        state.isLoading = false;
      }
    },
    resetLoader: (state) => {
      state.isLoading = false;
      state.loadingCount = 0;
    },
  },
});

export const { showLoader, hideLoader, resetLoader } = loaderSlice.actions;
export default loaderSlice.reducer;

