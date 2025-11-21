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
import ContactPage from './pages/ContactPage';
import AboutPage from './pages/AboutPage';
import VegetablesPage from './pages/VegetablesPage';
import FruitsPage from './pages/FruitsPage';
import DairyPage from './pages/DairyPage';
import HerbsPage from './pages/HerbsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import SearchResultsPage from './pages/SearchResultsPage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { useAuthRestore } from './hooks/useAuth';
import { useCartRestore } from './hooks/useCart';
import { useTokenRefresh } from './hooks/useTokenRefresh';
import ErrorBoundary from './components/common/ErrorBoundary';
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
  {
    path: "/contact",
    element: <ContactPage />,
  },
  {
    path: "/about",
    element: <AboutPage />,
  },
  {
    path: "/vegetables",
    element: <VegetablesPage />,
  },
  {
    path: "/fruits",
    element: <FruitsPage />,
  },
  {
    path: "/dairy",
    element: <DairyPage />,
  },
  {
    path: "/herbs",
    element: <HerbsPage />,
  },
  {
    path: "/product/:productId",
    element: <ProductDetailPage />,
  },
  {
    path: "/search",
    element: <SearchResultsPage />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
const App:React.FC = () => {
  useAuthRestore();
  useCartRestore();
  useTokenRefresh(); // Proactive token refresh when user is logged in
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        console.error("Unhandled React error:", error, errorInfo);
      }}
    >
      <RouterProvider router={router} />
    </ErrorBoundary>
  )
}
export default App
