import React from 'react'
import LandingPage from './pages/LandingPage'
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import SetPasswordPage from './pages/SetPasswordPage';
import VerifyCodePage from './pages/VerifyCodePage';
import FarmerRegistrationPage from './pages/FarmerRegistrationPage';
import FarmDetailsPage from './pages/FarmDetailsPage';
import BankDetailsPage from './pages/BankDetailsPage';
import FarmerLoginPage from './pages/FarmerLoginPage';
import FarmerDashboard from './pages/FarmerDashboard';
import FarmerForgotPasswordPage from './pages/FarmerForgotPasswordPage';
import FarmerVerifyCodePage from './pages/FarmerVerifyCodePage';
import FarmerResetPasswordPage from './pages/FarmerResetPasswordPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import PaymentPage from './pages/PaymentPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { useAuthRestore } from './hooks/useAuth';

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />, 
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPasswordPage />,
  },
  {
    path: "/reset-password",
    element: <SetPasswordPage />,
  },
  {
    path: "/verify-code",
    element: <VerifyCodePage />,
  },
  {
    path: "/farmer-registration",
    element: <FarmerRegistrationPage />,
  },
  {
    path: "/farm-details",
    element: <FarmDetailsPage />,
  },
  {
    path: "/bank-details",
    element: <BankDetailsPage />,
  },
  {
    path: "/farmer-login",
    element: <FarmerLoginPage />,
  },
  {
    path: "/farmer-dashboard",
    element: (
      <ProtectedRoute userType="farmer" redirectTo="/farmer-login">
        <FarmerDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/farmer-forgot-password",
    element: <FarmerForgotPasswordPage />,
  },
  {
    path: "/farmer-verify-code",
    element: <FarmerVerifyCodePage />,
  },
  {
    path: "/farmer-reset-password",
    element: <FarmerResetPasswordPage />,
  },
  {
    path: "/cart",
    element: <CartPage />,
  },
  {
    path: "/checkout",
    element: (
      <ProtectedRoute userType="user" redirectTo="/login">
        <CheckoutPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/payment",
    element: (
      <ProtectedRoute userType="user" redirectTo="/login">
        <PaymentPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/order-confirmation",
    element: (
      <ProtectedRoute userType="user" redirectTo="/login">
        <OrderConfirmationPage />
      </ProtectedRoute>
    ),
  },
]);

const App:React.FC = () => {
  // Restore authentication state on app load (non-blocking)
  // This allows the app to render immediately, auth restoration happens in background
  useAuthRestore();

  return (
    <>
    <RouterProvider router={router} />
    </>
  )
}

export default App
