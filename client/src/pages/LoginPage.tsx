import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import FormField from "@/components/auth/FormField";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import SocialLoginButton from "@/components/auth/SocialLoginButton";
import Divider from "@/components/auth/Divider";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("john.doe@gmail.com");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log("Login:", { email, password, rememberMe });
  };

  const handleSocialLogin = (provider: "facebook" | "google" | "apple") => {
    console.log(`Login with ${provider}`);
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Section - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col px-4 sm:px-6 lg:px-8 xl:px-10 py-6 sm:py-8 lg:py-10">
        <div className="max-w-sm w-full mx-auto lg:mx-0">
          {/* Logo */}
          <div className="mb-4 lg:mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 shrink-0" />
              <span className="text-xl font-bold text-gray-900">LocalHarvest</span>
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            Login
          </h1>
          <p className="text-sm sm:text-base text-gray-500 mb-6 lg:mb-8">
            Login to access your account
          </p>

          {/* Login Form */}
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

            {/* Password Field */}
            <FormField
              label="Password"
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              }
            />

            {/* Remember Me and Forgot Password */}
            <div className="flex items-center justify-between">
              <Checkbox
                id="remember-me"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                label="Remember me"
              />
              <Link
                to="/forgot-password"
                className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg text-base"
            >
              Login
            </Button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <span className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
              >
                Sign up
              </Link>
            </span>
          </div>

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

export default LoginPage;

