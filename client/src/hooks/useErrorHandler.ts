import { useCallback } from "react";
import { handleApiError, handleNetworkError as handleNetworkErrorUtil, logError, getErrorMessage } from "@/utils/errorHandler";
import { toast } from "react-toastify";

/**
 * Hook for handling errors in components
 * Provides convenient error handling functions
 */
export const useErrorHandler = () => {
  const handleError = useCallback((error: unknown, defaultMessage?: string) => {
    logError(error, "Component Error");
    handleApiError(error, defaultMessage);
  }, []);

  const handleNetworkError = useCallback((error: unknown) => {
    logError(error, "Network Error");
    handleNetworkErrorUtil(error);
  }, []);

  const handleErrorWithToast = useCallback((error: unknown, defaultMessage?: string) => {
    const message = defaultMessage || getErrorMessage(error);
    logError(error, "Component Error");
    toast.error(message);
  }, []);

  const handleSuccess = useCallback((message: string) => {
    toast.success(message);
  }, []);

  return {
    handleError,
    handleNetworkError,
    handleErrorWithToast,
    handleSuccess,
    getErrorMessage,
  };
};

