import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormField from "@/components/auth/FormField";
import { Button } from "@/components/ui/button";
import SocialLoginButton from "@/components/auth/SocialLoginButton";
import Divider from "@/components/auth/Divider";
import BackLink from "@/components/auth/BackLink";

const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("john.doe@gmail.com");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle forgot password logic here
    console.log("Forgot Password:", { email });
    // Navigate to set password page after email submission
    navigate("/set-password");
  };

  const handleSocialLogin = (provider: "facebook" | "google" | "apple") => {
    console.log(`Login with ${provider}`);
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Section - Forgot Password Form */}
      <div className="w-full lg:w-1/2 flex flex-col px-4 sm:px-6 lg:px-8 xl:px-10 py-6 sm:py-8 lg:py-10">
        <div className="max-w-sm w-full mx-auto lg:mx-0">
          {/* Logo */}
          <div className="mb-4 lg:mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 shrink-0" />
              <span className="text-xl font-bold text-gray-900">LocalHarvest</span>
            </div>
          </div>

          {/* Back Link */}
          <BackLink to="/login" />

          {/* Heading */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            Forgot your password?
          </h1>
          <p className="text-sm sm:text-base text-gray-500 mb-6 lg:mb-8">
            Enter your email below to recover your password
          </p>

          {/* Forgot Password Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <FormField
              label="Email"
              id="email"
              type="email"
              placeholder="john.doe@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg text-base"
            >
              Submit
            </Button>
          </form>

          {/* Divider */}
          <Divider text="Or login with" className="my-8" />

          {/* Social Login Buttons */}
          <div className="grid grid-cols-3 gap-4">
            <SocialLoginButton
              provider="facebook"
              onClick={() => handleSocialLogin("facebook")}
            />
            <SocialLoginButton
              provider="google"
              onClick={() => handleSocialLogin("google")}
            />
            <SocialLoginButton
              provider="apple"
              onClick={() => handleSocialLogin("apple")}
            />
          </div>
        </div>
      </div>

      {/* Right Section - Grey Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gray-100 rounded-l-3xl items-center justify-center p-6 xl:p-8">
        <div className="w-full max-w-xl h-[600px] rounded-2xl bg-gray-200" />
      </div>
    </div>
  );
};

export default ForgotPasswordPage;

