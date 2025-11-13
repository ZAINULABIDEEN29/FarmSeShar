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

// User Auth Hooks
export const useRegisterUser = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: RegisterUserInput) => userService.register(data),
    onSuccess: (response) => {
      toast.success(response.message || "Registration successful! Please verify your email.");
      if (response.user) {
        // Store only userId temporarily for verification flow (non-sensitive)
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
        // Store user data in Redux (memory)
        // Access and refresh tokens are stored in HTTP-only cookies (secure, not accessible to JavaScript)
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
      // Note: In production, user would click email link. For now, navigate to set-password
      navigate("/set-password");
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
        // Update user data in Redux
        // New access token is automatically stored in HTTP-only cookie by backend
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
        // Access token is sent via HTTP-only cookie automatically
        dispatch(setUser(response.user));
      }
      return response.user;
    },
    enabled: false, // Only fetch when explicitly called
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
      // Clear Redux state (tokens are cleared by backend via HTTP-only cookies)
      dispatch(logout());
      queryClient.clear();
      navigate("/login");
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || error.message || "Logout failed. Please try again.";
      toast.error(errorMessage);
      // Even on error, clear local state
      dispatch(logout());
      queryClient.clear();
    },
  });
};

// Farmer Auth Hooks
export const useRegisterFarmer = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: RegisterFarmerInput) => farmerService.register(data),
    onSuccess: (response) => {
      toast.success(response.message || "Farmer registration successful! Please verify your email.");
      if (response.farmer) {
        // Store only farmerId temporarily for verification flow (non-sensitive)
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
        // Store farmer data in Redux (memory)
        // Access and refresh tokens are stored in HTTP-only cookies (secure, not accessible to JavaScript)
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
        // Update farmer data in Redux
        // New access token is automatically stored in HTTP-only cookie by backend
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
        // Access token is sent via HTTP-only cookie automatically
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
      // Clear Redux state (tokens are cleared by backend via HTTP-only cookies)
      dispatch(logout());
      queryClient.clear();
      navigate("/farmer-login");
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || error.message || "Logout failed. Please try again.";
      toast.error(errorMessage);
      // Even on error, clear local state
      dispatch(logout());
      queryClient.clear();
    },
  });
};

/**
 * Hook to restore authentication state on app load
 * Uses refresh token (from HTTP-only cookie) to get new access token
 * This ensures users stay logged in after page refresh
 * Both tokens are stored in HTTP-only cookies (secure, not accessible to JavaScript)
 */
export const useAuthRestore = () => {
  const dispatch = useAppDispatch();
  const isRestoredRef = React.useRef(false);

  React.useEffect(() => {
    // Only restore once on mount
    if (isRestoredRef.current) return;
    
    const restoreAuth = async () => {
      isRestoredRef.current = true;
      
      try {
        // Try to refresh user token using refresh token cookie
        // Backend will verify refresh token and issue new access token in HTTP-only cookie
        // Returns success: false if no valid refresh token (not an error - user just not logged in)
        const userRefreshResponse = await userService.refreshToken();
        if (userRefreshResponse?.success && userRefreshResponse?.user) {
          dispatch(setUser(userRefreshResponse.user));
          dispatch(setRestoring(false));
          return; // Successfully restored user session
        }

        // Try to refresh farmer token using refresh token cookie
        // Backend will verify refresh token and issue new access token in HTTP-only cookie
        // Returns success: false if no valid refresh token (not an error - farmer just not logged in)
        const farmerRefreshResponse = await farmerService.refreshToken();
        if (farmerRefreshResponse?.success && farmerRefreshResponse?.farmer) {
          dispatch(setFarmer(farmerRefreshResponse.farmer));
          dispatch(setRestoring(false));
          return; // Successfully restored farmer session
        }

        // No valid refresh token found - user/farmer is not logged in
        // This is expected and not an error - they can still access public pages
      } catch (error) {
        // Network error or other unexpected error during restoration
        // User can still use the app - auth state will remain unauthenticated
        console.error("Auth restoration error:", error);
      } finally {
        // Mark restoration as complete (if not already set)
        dispatch(setRestoring(false));
      }
    };

    restoreAuth();
  }, [dispatch]);
};

