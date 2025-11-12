import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import FormField from "@/components/auth/FormField";
import { Button } from "@/components/ui/button";

const SetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [createPassword, setCreatePassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCreatePassword, setShowCreatePassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!createPassword || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (createPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    if (createPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Handle set password logic here
    console.log("Set Password:", { createPassword, confirmPassword });
    
    // Navigate to verify code page after successful password reset
    navigate("/verify-code");
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Section - Set Password Form */}
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
            Set a password
          </h1>
          <p className="text-sm sm:text-base text-gray-500 mb-6 lg:mb-8">
            Please set a new password for your account
          </p>

          {/* Set Password Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Create Password Field */}
            <FormField
              label="Create Password"
              id="create-password"
              type={showCreatePassword ? "text" : "password"}
              placeholder="Enter your password"
              value={createPassword}
              onChange={(e) => {
                setCreatePassword(e.target.value);
                setError("");
              }}
              required
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowCreatePassword(!showCreatePassword)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                  aria-label={showCreatePassword ? "Hide password" : "Show password"}
                >
                  {showCreatePassword ? (
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

            {/* Set Password Button */}
            <Button
              type="submit"
              className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg text-base"
            >
              Set password
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

export default SetPasswordPage;

