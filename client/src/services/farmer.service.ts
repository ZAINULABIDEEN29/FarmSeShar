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
  Farmer,
  UpdateFarmerProfileInput,
  UpdateFarmerProfileResponse,
} from "@/types/farmer.types";
export const farmerService = {
  register: async (data: RegisterFarmerInput): Promise<RegisterFarmerResponse> => {
    const response = await api.post<RegisterFarmerResponse>("/farmers/register-farmer", data);
    return response.data;
  },
  verifyCode: async (data: VerifyFarmerCodeInput): Promise<{ success: boolean; message: string }> => {
    const response = await api.post<{ success: boolean; message: string }>(
      "/farmers/verify-farmer",
      data
    );
    return response.data;
  },
  login: async (data: LoginFarmerInput): Promise<LoginFarmerResponse> => {
    const response = await api.post<LoginFarmerResponse>("/farmers/login-farmer", data);
    return response.data;
  },
  forgotPassword: async (
    data: ForgotPasswordFarmerInput
  ): Promise<{ success: boolean; message: string }> => {
    const response = await api.post<{ success: boolean; message: string }>(
      "/farmers/forgot-password",
      data
    );
    return response.data;
  },
  resetPassword: async (
    data: ResetPasswordFarmerInput
  ): Promise<{ success: boolean; message: string }> => {
    const response = await api.post<{ success: boolean; message: string }>(
      "/farmers/reset-password",
      data
    );
    return response.data;
  },
  getCurrentFarmer: async (): Promise<GetFarmerResponse> => {
    const response = await api.get<GetFarmerResponse>("/farmers/farmer");
    return response.data;
  },
  refreshToken: async (): Promise<{ success: boolean; farmer?: Farmer; message?: string }> => {
    const response = await api.post<{ success: boolean; farmer?: Farmer; message?: string }>(
      "/farmers/refresh"
    );
    return response.data;
  },
  logout: async (): Promise<{ success: boolean; message: string }> => {
    const response = await api.get<{ success: boolean; message: string }>("/farmers/logout");
    return response.data;
  },
  updateProfile: async (data: UpdateFarmerProfileInput): Promise<UpdateFarmerProfileResponse> => {
    const response = await api.put<UpdateFarmerProfileResponse>("/farmers/profile", data);
    return response.data;
  },
};
