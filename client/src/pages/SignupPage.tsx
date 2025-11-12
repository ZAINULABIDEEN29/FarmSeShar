import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import FormField from "@/components/auth/FormField";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import SocialLoginButton from "@/components/auth/SocialLoginButton";
import Divider from "@/components/auth/Divider";

const SignupPage: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!agreeToTerms) {
      setError("Please agree to the terms and conditions");
      return;
    }

    // Handle signup logic here
    console.log("Signup:", { name, email, password, agreeToTerms });
    
    // Navigate to login page after successful signup
    // navigate("/login");
  };

  const handleSocialLogin = (provider: "facebook" | "google" | "apple") => {
    console.log(`Sign up with ${provider}`);
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Section - Signup Form */}
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
            Sign up
          </h1>
          <p className="text-sm sm:text-base text-gray-500 mb-6 lg:mb-8">
            Create an account to get started
          </p>

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <FormField
              label="Name"
              id="name"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError("");
              }}
              required
            />

            {/* Email Field */}
            <FormField
              label="Email"
              id="email"
              type="email"
              placeholder="john.doe@gmail.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              required
            />

            {/* Password Field */}
            <FormField
              label="Password"
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
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

            {/* Confirm Password Field */}
            <FormField
              label="Confirm Password"
              id="confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setError("");
              }}
              required
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              }
            />

            {/* Terms and Conditions Checkbox */}
            <div className="flex items-start gap-2">
              <Checkbox
                id="terms"
                checked={agreeToTerms}
                onChange={(e) => {
                  setAgreeToTerms(e.target.checked);
                  setError("");
                }}
                className="mt-1"
              />
              <label
                htmlFor="terms"
                className="text-sm text-gray-600 cursor-pointer"
              >
                I agree to the{" "}
                <a href="#" className="text-red-600 hover:text-red-700 font-medium">
                  Terms and Conditions
                </a>{" "}
                and{" "}
                <a href="#" className="text-red-600 hover:text-red-700 font-medium">
                  Privacy Policy
                </a>
              </label>
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
                {error}
              </div>
            )}

            {/* Sign Up Button */}
            <Button
              type="submit"
              className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg text-base"
            >
              Sign up
            </Button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <span className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
              >
                Login
              </Link>
            </span>
          </div>

          {/* Divider */}
          <Divider text="Or sign up with" className="my-8" />

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

export default SignupPage;

