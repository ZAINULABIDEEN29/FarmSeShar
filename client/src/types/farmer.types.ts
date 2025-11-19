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
  profileImage?: string;
  createdAt?: string;
  updatedAt?: string;
}
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
export interface RegisterFarmerResponse {
  success: boolean;
  message: string;
  farmer: Farmer;
}
export interface LoginFarmerResponse {
  message: string;
  farmer: Farmer;
}
export interface GetFarmerResponse {
  success: boolean;
  farmer: Farmer;
}
export interface UpdateFarmerProfileInput {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  farmName?: string;
  farmLocation?: string;
  farmDescription?: string;
  accountHolderName?: string;
  bankAccountNumber?: string;
  profileImage?: string;
}
export interface UpdateFarmerProfileResponse {
  success: boolean;
  message: string;
  farmer: Farmer;
}
