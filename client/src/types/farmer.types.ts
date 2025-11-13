// Farmer Types
export interface FullName {
  firstName: string;
  lastName: string;
}

export interface Farmer {
  _id: string;
  fullName: FullName;
  cnic: string;
  email: string;
  phoneNumber: string;
  farmName: string;
  farmLocation: string;
  farmDescription: string;
  accountHolderName: string;
  bankAccountNumber: string;
  isVerified: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Farmer Registration Types
export interface RegisterFarmerInput {
  fullName: FullName;
  cnic: string;
  email: string;
  phoneNumber: string;
  farmName: string;
  farmLocation: string;
  farmDescription: string;
  accountHolderName: string;
  bankAccountNumber: string;
  password: string;
}

export interface LoginFarmerInput {
  email: string;
  password: string;
}

export interface VerifyFarmerCodeInput {
  farmerId: string;
  code: string;
}

export interface ForgotPasswordFarmerInput {
  email: string;
}

export interface ResetPasswordFarmerInput {
  farmerId: string;
  token: string;
  newPassword: string;
}

// API Response Types
export interface RegisterFarmerResponse {
  success: boolean;
  message: string;
  farmer: Farmer;
}

export interface LoginFarmerResponse {
  message: string;
  farmer: Farmer;
  // Access and refresh tokens are stored in HTTP-only cookies (secure, not accessible to JavaScript)
}

export interface GetFarmerResponse {
  success: boolean;
  farmer: Farmer;
}

