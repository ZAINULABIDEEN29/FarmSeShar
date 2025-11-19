import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { userService } from "@/services/user.service";
import { farmerService } from "@/services/farmer.service";
import { useAppDispatch } from "@/store/hooks";
import { setUser, setFarmer, setRestoring, logout } from "@/store/slices/authSlice";
import type {
  RegisterUserInput,
  LoginUserInput,
  VerifyCodeInput,
  ForgotPasswordInput,
  ResetPasswordInput,
} from "@/types/user.types";
import type {
  RegisterFarmerInput,
  LoginFarmerInput,
  VerifyFarmerCodeInput,
  ForgotPasswordFarmerInput,
  ResetPasswordFarmerInput,
} from "@/types/farmer.types";
import { storage, STORAGE_KEYS } from "@/utils/storage";
export const useRegisterUser = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (data: RegisterUserInput) => userService.register(data),
    onSuccess: (response) => {
      toast.success(response.message || "Registration successful! Please verify your email.");
      if (response.user) {
        storage.set(STORAGE_KEYS.USER_ID, response.user._id);
        navigate("/verify-code");
      }
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || error.message || "Registration failed. Please try again.";
      toast.error(errorMessage);
    },
  });
};
export const useVerifyUserCode = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: VerifyCodeInput) => userService.verifyCode(data),
    onSuccess: (response) => {
      toast.success(response.message || "Email verified successfully!");
      storage.remove(STORAGE_KEYS.USER_ID);
      queryClient.invalidateQueries({ queryKey: ["user"] });
      navigate("/login");
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || error.message || "Verification failed. Please try again.";
      toast.error(errorMessage);
    },
  });
};
export const useLoginUser = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: LoginUserInput) => userService.login(data),
    onSuccess: (response) => {
      toast.success(response.message || "Login successful!");
      if (response.user) {
        dispatch(setUser(response.user));
        queryClient.setQueryData(["user"], response.user);
        navigate("/");
      }
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || error.message || "Login failed. Please check your credentials.";
      toast.error(errorMessage);
    },
  });
};
export const useForgotPassword = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (data: ForgotPasswordInput) => userService.forgotPassword(data),
    onSuccess: (response) => {
      toast.success(response.message || "Password reset link sent to your email.");
      navigate("/reset-password");
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || error.message || "Failed to send reset link. Please try again.";
      toast.error(errorMessage);
    },
  });
};
export const useResetPassword = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (data: ResetPasswordInput) => userService.resetPassword(data),
    onSuccess: (response) => {
      toast.success(response.message || "Password reset successfully!");
      navigate("/login");
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || error.message || "Password reset failed. Please try again.";
      toast.error(errorMessage);
    },
  });
};
export const useRefreshUserToken = () => {
  const dispatch = useAppDispatch();
  return useMutation({
    mutationFn: () => userService.refreshToken(),
    onSuccess: (response) => {
      if (response.user) {
        dispatch(setUser(response.user));
      }
    },
  });
};
export const useGetCurrentUser = () => {
  const dispatch = useAppDispatch();
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const response = await userService.getCurrentUser();
      if (response.user) {
        dispatch(setUser(response.user));
      }
      return response.user;
    },
    enabled: false,
  });
};
export const useLogoutUser = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => userService.logout(),
    onSuccess: (response) => {
      toast.success(response.message || "Logged out successfully!");
      dispatch(logout());
      queryClient.clear();
      navigate("/login");
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || error.message || "Logout failed. Please try again.";
      toast.error(errorMessage);
      dispatch(logout());
      queryClient.clear();
    },
  });
};
export const useRegisterFarmer = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (data: RegisterFarmerInput) => farmerService.register(data),
    onSuccess: (response) => {
      toast.success(response.message || "Farmer registration successful! Please verify your email.");
      if (response.farmer) {
        storage.set(STORAGE_KEYS.FARMER_ID, response.farmer._id);
        navigate("/verify-code");
      }
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || error.message || "Registration failed. Please try again.";
      toast.error(errorMessage);
    },
  });
};
export const useVerifyFarmerCode = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: VerifyFarmerCodeInput) => farmerService.verifyCode(data),
    onSuccess: (response) => {
      toast.success(response.message || "Farmer verified successfully!");
      storage.remove(STORAGE_KEYS.FARMER_ID);
      queryClient.invalidateQueries({ queryKey: ["farmer"] });
      navigate("/farmer-login");
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || error.message || "Verification failed. Please try again.";
      toast.error(errorMessage);
    },
  });
};
export const useLoginFarmer = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: LoginFarmerInput) => farmerService.login(data),
    onSuccess: (response) => {
      toast.success(response.message || "Login successful!");
      if (response.farmer) {
        dispatch(setFarmer(response.farmer));
        queryClient.setQueryData(["farmer"], response.farmer);
        navigate("/farmer-dashboard");
      }
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || error.message || "Login failed. Please check your credentials.";
      toast.error(errorMessage);
    },
  });
};
export const useForgotPasswordFarmer = () => {
  return useMutation({
    mutationFn: (data: ForgotPasswordFarmerInput) => farmerService.forgotPassword(data),
    onSuccess: (response) => {
      toast.success(response.message || "Password reset link sent to your email.");
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || error.message || "Failed to send reset link. Please try again.";
      toast.error(errorMessage);
    },
  });
};
export const useResetPasswordFarmer = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (data: ResetPasswordFarmerInput) => farmerService.resetPassword(data),
    onSuccess: (response) => {
      toast.success(response.message || "Password reset successfully!");
      navigate("/farmer-login");
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || error.message || "Password reset failed. Please try again.";
      toast.error(errorMessage);
    },
  });
};
export const useRefreshFarmerToken = () => {
  const dispatch = useAppDispatch();
  return useMutation({
    mutationFn: () => farmerService.refreshToken(),
    onSuccess: (response) => {
      if (response.farmer) {
        dispatch(setFarmer(response.farmer));
      }
    },
  });
};
export const useGetCurrentFarmer = () => {
  const dispatch = useAppDispatch();
  return useQuery({
    queryKey: ["farmer"],
    queryFn: async () => {
      const response = await farmerService.getCurrentFarmer();
      if (response.farmer) {
        dispatch(setFarmer(response.farmer));
      }
      return response.farmer;
    },
    enabled: false,
  });
};
export const useLogoutFarmer = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => farmerService.logout(),
    onSuccess: (response) => {
      toast.success(response.message || "Logged out successfully!");
      dispatch(logout());
      queryClient.clear();
      navigate("/farmer-login");
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || error.message || "Logout failed. Please try again.";
      toast.error(errorMessage);
      dispatch(logout());
      queryClient.clear();
    },
  });
};
export const useAuthRestore = () => {
  const dispatch = useAppDispatch();
  const isRestoredRef = React.useRef(false);
  React.useEffect(() => {
    if (isRestoredRef.current) return;
    const restoreAuth = async () => {
      isRestoredRef.current = true;
      try {
        const userRefreshResponse = await userService.refreshToken();
        if (userRefreshResponse?.success && userRefreshResponse?.user) {
          dispatch(setUser(userRefreshResponse.user));
          dispatch(setRestoring(false));
          return;
        }
        const farmerRefreshResponse = await farmerService.refreshToken();
        if (farmerRefreshResponse?.success && farmerRefreshResponse?.farmer) {
          dispatch(setFarmer(farmerRefreshResponse.farmer));
          dispatch(setRestoring(false));
          return;
        }
      } catch (error) {
        console.error("Auth restoration error:", error);
      } finally {
        dispatch(setRestoring(false));
      }
    };
    restoreAuth();
  }, [dispatch]);
};
