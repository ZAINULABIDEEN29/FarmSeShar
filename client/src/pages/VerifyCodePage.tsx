import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import FormField from "@/components/auth/FormField";
import { Button } from "@/components/ui/button";
import BackLink from "@/components/auth/BackLink";

const VerifyCodePage: React.FC = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [showCode, setShowCode] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!code) {
      setError("Please enter the verification code");
      return;
    }

    if (code.length < 4) {
      setError("Code must be at least 4 characters");
      return;
    }

    // Handle verify code logic here
    console.log("Verify Code:", { code });
    
    // Navigate to login page after successful verification
    navigate("/login");
  };

  const handleResend = () => {
    // Handle resend code logic here
    console.log("Resend code");
    setError("");
    setCode("");
    // You can add a toast notification here
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Section - Verify Code Form */}
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
            Verify Code
          </h1>
          <p className="text-sm sm:text-base text-gray-500 mb-6 lg:mb-8">
            An authentication code has been sent to your email
          </p>

          {/* Verify Code Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Code Field */}
            <FormField
              label="Code"
              id="code"
              type={showCode ? "text" : "password"}
              placeholder="Enter verification code"
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                setError("");
              }}
              required
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowCode(!showCode)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                  aria-label={showCode ? "Hide code" : "Show code"}
                >
                  {showCode ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              }
            />

            {/* Resend Link */}
            <div className="text-sm text-gray-600">
              Didn't receive a code?{" "}
              <button
                type="button"
                onClick={handleResend}
                className="text-red-600 hover:text-red-700 font-medium transition-colors"
              >
                Resend
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
                {error}
              </div>
            )}

            {/* Verify Button */}
            <Button
              type="submit"
              className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg text-base"
            >
              Verify
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

export default VerifyCodePage;

