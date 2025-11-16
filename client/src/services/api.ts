import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import config from "@/conf/conf";
import { store } from "@/store";
import { logout } from "@/store/slices/authSlice";
import { handleApiError, handleNetworkError, logError } from "@/utils/errorHandler";

// Flag to track if we're currently restoring auth (to avoid clearing state during restoration)
let isRestoringAuth = false;

const getBaseURL = () => {
  if (config.backenedURL) {
    return config.backenedURL.endsWith('/api') 
      ? config.backenedURL 
      : `${config.backenedURL}/api`;
  }
  return 'http://localhost:8000/api';
};

export const api = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true, // Important: Send HTTP-only cookies (access and refresh tokens) with requests
  headers: {
    "Content-Type": "application/json",
  },
});

if (import.meta.env.DEV) {
  console.log('API Base URL:', getBaseURL());
}

// Request interceptor - tokens are automatically sent via HTTP-only cookies
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Check if this is an auth restoration request
    if (
      config.url?.includes("/users/me") ||
      config.url?.includes("/farmers/farmer") ||
      config.url?.includes("/users/refresh") ||
      config.url?.includes("/farmers/refresh")
    ) {
      isRestoringAuth = true;
    }

    // Tokens are automatically sent via HTTP-only cookies (withCredentials: true)
    // No need to manually add Authorization header
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors and automatic token refresh
api.interceptors.response.use(
  (response) => {
    // Reset restoring flag on successful response
    if (
      response.config.url?.includes("/users/me") ||
      response.config.url?.includes("/farmers/farmer") ||
      response.config.url?.includes("/users/refresh") ||
      response.config.url?.includes("/farmers/refresh")
    ) {
      isRestoringAuth = false;
    }
    return response;
  },
  async (error: AxiosError) => {
    // Reset restoring flag on error
    if (
      error.config?.url?.includes("/users/me") ||
      error.config?.url?.includes("/farmers/farmer") ||
      error.config?.url?.includes("/users/refresh") ||
      error.config?.url?.includes("/farmers/refresh")
    ) {
      isRestoringAuth = false;
    }
    
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    
    // Handle both 401 and 403 errors (403 can occur on refresh token mismatch)
    const isAuthError = error.response?.status === 401 || error.response?.status === 403;
    
    if (isAuthError && originalRequest && !originalRequest._retry) {
      const currentPath = window.location.pathname;
      
      // Public pages that don't require authentication
      const publicPages = [
        "/",
        "/login",
        "/signup",
        "/forgot-password",
        "/reset-password",
        "/verify-code",
        "/farmer-login",
        "/farmer-registration",
        "/farmer-forgot-password",
        "/farmer-reset-password",
        "/farmer-verify-code",
        "/farm-details",
        "/bank-details",
        "/contact",
        "/about",
        "/vegetables",
        "/fruits",
        "/dairy",
        "/herbs",
      ];
      
      const isPublicPage = publicPages.includes(currentPath);
      const isRefreshEndpoint = originalRequest.url?.includes("/refresh");
      
      // Don't handle auth errors during auth restoration - let restoration hook handle it
      if (isRestoringAuth) {
        // During restoration, let the restoration hook handle auth state
        // Silently reject to prevent interceptor from interfering
        return Promise.reject(error);
      }
      
      // Don't handle auth errors on refresh endpoints - they return 200 with success: false if no valid token
      // The restoration hook handles refresh endpoint responses
      if (isRefreshEndpoint) {
        return Promise.reject(error);
      }
      
      // Try to refresh token automatically if access token expired
      // Only for protected endpoints (not public pages or auth endpoints)
      if (!isPublicPage && !originalRequest.url?.includes("/login") && !originalRequest.url?.includes("/register")) {
        originalRequest._retry = true;
        
        try {
          // Determine if this is a user or farmer request
          const isFarmerRequest = originalRequest.url?.includes("/farmers/");
          
          // Attempt to refresh token using refresh token cookie
          // Refresh endpoint returns 200 with success: false if no valid refresh token
          const refreshResponse = isFarmerRequest
            ? await api.post<{ success: boolean }>("/farmers/refresh")
            : await api.post<{ success: boolean }>("/users/refresh");
          
          // Check if refresh was successful
          if (refreshResponse.data.success) {
            // Retry the original request with new access token (in cookie)
            return api(originalRequest);
          } else {
            // Refresh failed - refresh token is invalid or expired
            // User needs to log in again
            store.dispatch(logout());
            
            const redirectTo = currentPath.startsWith("/farmer") 
              ? "/farmer-login" 
              : "/login";
            
            setTimeout(() => {
              window.location.href = redirectTo;
            }, 0);
            
            return Promise.reject(new Error("Refresh token invalid or expired"));
          }
        } catch (refreshError) {
          // Network error or other error during refresh
          // User needs to log in again
          store.dispatch(logout());
          
          const redirectTo = currentPath.startsWith("/farmer") 
            ? "/farmer-login" 
            : "/login";
          
          setTimeout(() => {
            window.location.href = redirectTo;
          }, 0);
          
          return Promise.reject(refreshError);
        }
      } else {
        // On public pages or auth endpoints, just clear state silently
        // User can still access the page
        store.dispatch(logout());
      }
      
      // Reject auth errors without showing toast (handled by interceptor logic)
      return Promise.reject(error);
    }
    
    // Handle network errors (no response from server)
    if (!error.response) {
      logError(error, "Network Error");
      handleNetworkError(error);
      return Promise.reject(error);
    }
    
    // Handle other API errors (4xx, 5xx)
    const status = error.response.status;
    
    // Log error for monitoring
    logError(error, `API Error (${status})`);
    
    // Don't show toast for auth errors (already handled above)
    if (status !== 401 && status !== 403) {
      // Show error toast for other errors
      handleApiError(error);
    }
    
    return Promise.reject(error);
  }
);

export default api;

