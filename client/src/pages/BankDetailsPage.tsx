import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import FormField from "@/components/auth/FormField";
import { Button } from "@/components/ui/button";
import StepIndicator from "@/components/auth/StepIndicator";

const BankDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const [accountHolderName, setAccountHolderName] = useState("John Doe");
  const [accountNumber, setAccountNumber] = useState("PK36SCBL0000001123456702");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!accountHolderName || !accountNumber || !password || !confirmPassword) {
      setError("Please fill in all required fields");
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

    // Handle bank details and registration logic here
    console.log("Bank Details:", {
      accountHolderName,
      accountNumber,
      password,
      confirmPassword,
    });

    // Navigate to login page after successful registration
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Section - Bank Details Form */}
      <div className="w-full lg:w-1/2 flex flex-col px-4 sm:px-6 lg:px-8 xl:px-10 py-6 sm:py-8 lg:py-10">
        <div className="max-w-sm w-full mx-auto lg:mx-0">
          {/* Logo */}
          <div className="mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 shrink-0" />
              <span className="text-xl font-bold text-gray-900">LocalHarvest</span>
            </div>
          </div>

          {/* Step Indicator with Back Button */}
          <StepIndicator
            currentStep={3}
            totalSteps={3}
            backTo="/farm-details"
          />

          {/* Heading */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            Bank Details
          </h1>
          <p className="text-sm sm:text-base text-gray-500 mb-6 lg:mb-8">
            This secure step ensures you receive timely payments for your sales and sets up your account login
          </p>

          {/* Bank Details Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Account Holder Name */}
            <FormField
              label="Account Holder Name"
              id="account-holder-name"
              type="text"
              placeholder="John Doe"
              value={accountHolderName}
              onChange={(e) => {
                setAccountHolderName(e.target.value);
                setError("");
              }}
              required
            />

            {/* Account Number */}
            <FormField
              label="Account Number"
              id="account-number"
              type="text"
              placeholder="PK36SCBL0000001123456702"
              value={accountNumber}
              onChange={(e) => {
                setAccountNumber(e.target.value);
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
        </div>
      </div>

      {/* Right Section - Grey Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gray-100 rounded-l-3xl items-center justify-center p-6 xl:p-8">
        <div className="w-full max-w-xl h-[600px] rounded-2xl bg-gray-200" />
      </div>
    </div>
  );
};

export default BankDetailsPage;

