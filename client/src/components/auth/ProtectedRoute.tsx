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
  const { isAuthenticated, userType: authUserType } = useAppSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to={redirectTo || "/login"} replace />;
  }

  if (userType && authUserType !== userType) {
    return <Navigate to={redirectTo || "/login"} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

