import api from "./api";
import type {
  RegisterUserInput,
  LoginUserInput,
  VerifyCodeInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  RegisterUserResponse,
  LoginUserResponse,
  GetUserResponse,
} from "@/types/user.types";

// User API Service Layer
export const userService = {
  // Register a new user
  register: async (data: RegisterUserInput): Promise<RegisterUserResponse> => {
    const response = await api.post<RegisterUserResponse>("/users/create", data);
    return response.data;
  },

  // Verify OTP code
  verifyCode: async (data: VerifyCodeInput): Promise<{ success: boolean; message: string }> => {
    const response = await api.post<{ success: boolean; message: string }>("/users/verify", data);
    return response.data;
  },

  // Login user
  login: async (data: LoginUserInput): Promise<LoginUserResponse> => {
    const response = await api.post<LoginUserResponse>("/users/login", data);
    return response.data;
  },

  // Forgot password
  forgotPassword: async (data: ForgotPasswordInput): Promise<{ success: boolean; message: string }> => {
    const response = await api.post<{ success: boolean; message: string }>(
      "/users/forgot-password",
      data
    );
    return response.data;
  },

  // Reset password
  resetPassword: async (data: ResetPasswordInput): Promise<{ success: boolean; message: string }> => {
    const response = await api.post<{ success: boolean; message: string }>(
      "/users/reset-password",
      data
    );
    return response.data;
  },

  // Get current user
  getCurrentUser: async (): Promise<GetUserResponse> => {
    const response = await api.get<GetUserResponse>("/users/me");
    return response.data;
  },

  // Logout user
  logout: async (): Promise<{ success: boolean; message: string }> => {
    const response = await api.get<{ success: boolean; message: string }>("/users/logout");
    return response.data;
  },
};

