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
  User,
} from "@/types/user.types";
export const userService = {
  register: async (data: RegisterUserInput): Promise<RegisterUserResponse> => {
    const response = await api.post<RegisterUserResponse>("/users/create", data);
    return response.data;
  },
  verifyCode: async (data: VerifyCodeInput): Promise<{ success: boolean; message: string }> => {
    const response = await api.post<{ success: boolean; message: string }>("/users/verify", data);
    return response.data;
  },
  login: async (data: LoginUserInput): Promise<LoginUserResponse> => {
    const response = await api.post<LoginUserResponse>("/users/login", data);
    return response.data;
  },
  forgotPassword: async (data: ForgotPasswordInput): Promise<{ success: boolean; message: string }> => {
    const response = await api.post<{ success: boolean; message: string }>(
      "/users/forgot-password",
      data
    );
    return response.data;
  },
  resetPassword: async (data: ResetPasswordInput): Promise<{ success: boolean; message: string }> => {
    const response = await api.post<{ success: boolean; message: string }>(
      "/users/reset-password",
      data
    );
    return response.data;
  },
  getCurrentUser: async (): Promise<GetUserResponse> => {
    const response = await api.get<GetUserResponse>("/users/me");
    return response.data;
  },
  refreshToken: async (): Promise<{ success: boolean; user?: User; message?: string }> => {
    const response = await api.post<{ success: boolean; user?: User; message?: string }>(
      "/users/refresh"
    );
    return response.data;
  },
  logout: async (): Promise<{ success: boolean; message: string }> => {
    const response = await api.get<{ success: boolean; message: string }>("/users/logout");
    return response.data;
  },
};
