import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import config from "@/conf/conf";
import { store } from "@/store";
import { logout } from "@/store/slices/authSlice";
import { handleApiError, handleNetworkError, logError } from "@/utils/errorHandler";
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
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
if (import.meta.env.DEV) {
  console.log('API Base URL:', getBaseURL());
}
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (
      config.url?.includes("/users/me") ||
      config.url?.includes("/farmers/farmer") ||
      config.url?.includes("/users/refresh") ||
      config.url?.includes("/farmers/refresh")
    ) {
      isRestoringAuth = true;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
api.interceptors.response.use(
  (response) => {
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
    if (
      error.config?.url?.includes("/users/me") ||
      error.config?.url?.includes("/farmers/farmer") ||
      error.config?.url?.includes("/users/refresh") ||
      error.config?.url?.includes("/farmers/refresh")
    ) {
      isRestoringAuth = false;
    }
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    const isAuthError = error.response?.status === 401 || error.response?.status === 403;
    if (isAuthError && originalRequest && !originalRequest._retry) {
      const currentPath = window.location.pathname;
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
      if (isRestoringAuth) {
        return Promise.reject(error);
      }
      if (isRefreshEndpoint) {
        return Promise.reject(error);
      }
      if (!isPublicPage && !originalRequest.url?.includes("/login") && !originalRequest.url?.includes("/register")) {
        originalRequest._retry = true;
        try {
          const isFarmerRequest = originalRequest.url?.includes("/farmers/");
          const refreshResponse = isFarmerRequest
            ? await api.post<{ success: boolean }>("/farmers/refresh")
            : await api.post<{ success: boolean }>("/users/refresh");
          if (refreshResponse.data.success) {
            return api(originalRequest);
          } else {
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
        store.dispatch(logout());
      }
      return Promise.reject(error);
    }
    if (!error.response) {
      logError(error, "Network Error");
      handleNetworkError(error);
      return Promise.reject(error);
    }
    const status = error.response.status;
    logError(error, `API Error (${status})`);
    if (status !== 401 && status !== 403) {
      handleApiError(error);
    }
    return Promise.reject(error);
  }
);
export default api;
