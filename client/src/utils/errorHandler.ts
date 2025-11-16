import { AxiosError } from "axios";
import { toast } from "react-toastify";

export interface ApiErrorResponse {
  success?: boolean;
  message?: string;
  error?: string;
  errors?: Array<{ field: string; message: string }>;
}

/**
 * Extract error message from API error response
 */
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    const response = error.response?.data as ApiErrorResponse | undefined;
    
    // Check for validation errors
    if (response?.errors && Array.isArray(response.errors) && response.errors.length > 0) {
      return response.errors.map((e) => e.message).join(", ");
    }
    
    // Check for error message
    if (response?.message) {
      return response.message;
    }
    
    // Check for error field
    if (response?.error) {
      return response.error;
    }
    
    // Check HTTP status and provide default messages
    const status = error.response?.status;
    switch (status) {
      case 400:
        return "Invalid request. Please check your input.";
      case 401:
        return "Authentication required. Please log in.";
      case 403:
        return "You don't have permission to perform this action.";
      case 404:
        return "Resource not found.";
      case 409:
        return "This resource already exists.";
      case 422:
        return "Validation failed. Please check your input.";
      case 429:
        return "Too many requests. Please try again later.";
      case 500:
        return "Server error. Please try again later.";
      case 503:
        return "Service unavailable. Please try again later.";
      default:
        return error.message || "An error occurred. Please try again.";
    }
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return "An unexpected error occurred. Please try again.";
};

/**
 * Handle API errors with toast notifications
 */
export const handleApiError = (
  error: unknown,
  defaultMessage?: string
): void => {
  const message = defaultMessage || getErrorMessage(error);
  
  // Don't show toast for 401/403 errors (handled by interceptor)
  if (error instanceof AxiosError) {
    const status = error.response?.status;
    if (status === 401 || status === 403) {
      // These are handled by the auth interceptor
      return;
    }
  }
  
  toast.error(message);
};

/**
 * Handle network errors specifically
 */
export const handleNetworkError = (error: unknown): void => {
  if (error instanceof AxiosError) {
    if (!error.response) {
      // Network error (no response from server)
      toast.error("Network error. Please check your connection and try again.");
      return;
    }
  }
  
  handleApiError(error);
};

/**
 * Log error for monitoring/debugging
 */
export const logError = (error: unknown, context?: string): void => {
  const errorMessage = getErrorMessage(error);
  const errorDetails = {
    message: errorMessage,
    context,
    error: error instanceof Error ? error.stack : String(error),
    timestamp: new Date().toISOString(),
  };
  
  // Log to console in development
  if (import.meta.env.DEV) {
    console.error("Error logged:", errorDetails);
  }
  
  // TODO: Send to error tracking service (e.g., Sentry, LogRocket)
  // logErrorToService(errorDetails);
};

