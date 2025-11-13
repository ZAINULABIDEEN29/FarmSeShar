import axios, { AxiosError } from "axios";
import config from "@/conf/conf";

// Ensure baseURL includes /api prefix
// Default to port 8000 to match docker-compose.yml, or use env variable
const getBaseURL = () => {
  if (config.backenedURL) {
    // If env variable is set, use it
    return config.backenedURL.endsWith('/api') 
      ? config.backenedURL 
      : `${config.backenedURL}/api`;
  }
  // Default fallback - try 8000 first (docker), then 5000 (local dev)
  return 'http://localhost:8000/api';
};

export const api = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Log the baseURL for debugging (only in development)
if (import.meta.env.DEV) {
  console.log('API Base URL:', getBaseURL());
}

api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            const currentPath = window.location.pathname;
            // Use setTimeout to avoid blocking the main thread
            const isAuthPage = 
              currentPath === "/login" || 
              currentPath === "/signup" || 
              currentPath === "/farmer-login" || 
              currentPath === "/farmer-registration";
            
            if (!isAuthPage) {
              // Determine redirect based on current path
              const redirectTo = currentPath.startsWith("/farmer") 
                ? "/farmer-login" 
                : "/login";
              
              setTimeout(() => {
                window.location.href = redirectTo;
              }, 0);
            }
        }
        return Promise.reject(error);
    }
);


export default api;

