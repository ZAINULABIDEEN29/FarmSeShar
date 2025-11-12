import api from "./api";
import type {
  RegisterFarmerInput,
  LoginFarmerInput,
  VerifyFarmerCodeInput,
  ForgotPasswordFarmerInput,
  ResetPasswordFarmerInput,
  RegisterFarmerResponse,
  LoginFarmerResponse,
  GetFarmerResponse,
} from "@/types/farmer.types";

// Farmer API Service Layer
export const farmerService = {
  // Register a new farmer
  register: async (data: RegisterFarmerInput): Promise<RegisterFarmerResponse> => {
    const response = await api.post<RegisterFarmerResponse>("/farmers/register-farmer", data);
    return response.data;
  },

  // Verify farmer code
  verifyCode: async (data: VerifyFarmerCodeInput): Promise<{ success: boolean; message: string }> => {
    const response = await api.post<{ success: boolean; message: string }>(
      "/farmers/verify-farmer",
      data
    );
    return response.data;
  },

  // Login farmer
  login: async (data: LoginFarmerInput): Promise<LoginFarmerResponse> => {
    const response = await api.post<LoginFarmerResponse>("/farmers/login-farmer", data);
    return response.data;
  },

  // Forgot password
  forgotPassword: async (
    data: ForgotPasswordFarmerInput
  ): Promise<{ success: boolean; message: string }> => {
    const response = await api.post<{ success: boolean; message: string }>(
      "/farmers/forgot-password",
      data
    );
    return response.data;
  },

  // Reset password
  resetPassword: async (
    data: ResetPasswordFarmerInput
  ): Promise<{ success: boolean; message: string }> => {
    const response = await api.post<{ success: boolean; message: string }>(
      "/farmers/reset-password",
      data
    );
    return response.data;
  },

  // Get current farmer
  getCurrentFarmer: async (): Promise<GetFarmerResponse> => {
    const response = await api.get<GetFarmerResponse>("/farmers/farmer");
    return response.data;
  },

  // Logout farmer
  logout: async (): Promise<{ success: boolean; message: string }> => {
    const response = await api.get<{ success: boolean; message: string }>("/farmers/logout");
    return response.data;
  },
};

