import React from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";

interface ProtectedRouteProps {
  children: React.ReactNode;
  userType?: "user" | "farmer";
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  userType,
  redirectTo,
}) => {
  const { isAuthenticated, userType: authUserType, isRestoring } = useAppSelector(
    (state) => state.auth
  );

  // Wait for auth restoration to complete before redirecting
  // This ensures users stay logged in after page refresh
  if (isRestoring) {
    // Show loading state while restoring auth
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Only redirect if restoration is complete and user is not authenticated
  if (!isAuthenticated) {
    return <Navigate to={redirectTo || "/login"} replace />;
  }

  // Check user type matches if specified
  if (userType && authUserType !== userType) {
    return <Navigate to={redirectTo || "/login"} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

