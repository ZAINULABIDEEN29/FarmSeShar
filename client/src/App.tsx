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
]);

const App:React.FC = () => {
 

  return (
    <>
    <RouterProvider router={router} />
    </>
  )
}

export default App
