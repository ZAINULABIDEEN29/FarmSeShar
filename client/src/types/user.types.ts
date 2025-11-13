// User Types
export interface FullName {
  firstName: string;
  lastName: string;
}

export interface User {
  _id: string;
  fullName: FullName;
  email: string;
  phoneNumber: string;
  isVerified: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// User Registration Types
export interface RegisterUserInput {
  fullName: FullName;
  email: string;
  phoneNumber: string;
  password: string;
}

export interface LoginUserInput {
  email: string;
  password: string;
}

export interface VerifyCodeInput {
  userId: string;
  otp: string;
}

export interface ForgotPasswordInput {
  email: string;
}

export interface ResetPasswordInput {
  userId: string;
  token: string;
  newPassword: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

export interface RegisterUserResponse {
  success: boolean;
  message: string;
  user: User;
}

export interface LoginUserResponse {
  message: string;
  user: User;
  // Access and refresh tokens are stored in HTTP-only cookies (secure, not accessible to JavaScript)
}

export interface GetUserResponse {
  success: boolean;
  user: User;
}

