import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FormField from "@/components/auth/FormField";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import SocialLoginButton from "@/components/auth/SocialLoginButton";
import Divider from "@/components/auth/Divider";
import StepIndicator from "@/components/auth/StepIndicator";

const FarmerRegistrationPage: React.FC = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [cnic, setCnic] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!firstName || !lastName || !email || !phoneNumber || !cnic) {
      setError("Please fill in all required fields");
      return;
    }

    if (!agreeToTerms) {
      setError("Please agree to the Terms and Privacy Policies");
      return;
    }

    // Handle farmer registration logic here
    console.log("Farmer Registration:", {
      firstName,
      lastName,
      email,
      phoneNumber,
      cnic,
      agreeToTerms,
    });

    // Navigate to next step (Step 2 of 3)
    navigate("/farm-details");
  };

  const handleSocialLogin = (provider: "facebook" | "google" | "apple") => {
    console.log(`Sign up with ${provider}`);
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Section - Registration Form */}
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
            currentStep={1}
            totalSteps={3}
            backTo="/"
          />

          {/* Heading */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            Join as a Farmer
          </h1>
          <p className="text-sm sm:text-base text-gray-500 mb-6 lg:mb-8">
            Register to sell your organic products directly to consumers
          </p>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* First Name and Last Name - Two Columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                label="First Name"
                id="first-name"
                type="text"
                placeholder="John"
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                  setError("");
                }}
                required
              />
              <FormField
                label="Last Name"
                id="last-name"
                type="text"
                placeholder="Doe"
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                  setError("");
                }}
                required
              />
            </div>

            {/* Email and Phone Number - Two Columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              <FormField
                label="Phone Number"
                id="phone-number"
                type="tel"
                placeholder="03335603955"
                value={phoneNumber}
                onChange={(e) => {
                  setPhoneNumber(e.target.value);
                  setError("");
                }}
                required
              />
            </div>

            {/* CNIC - Full Width */}
            <FormField
              label="CNIC"
              id="cnic"
              type="text"
              placeholder="XXXXX-XXXXXXX-X"
              value={cnic}
              onChange={(e) => {
                setCnic(e.target.value);
                setError("");
              }}
              required
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
                I agree to all the{" "}
                <a href="#" className="text-red-600 hover:text-red-700 font-medium">
                  Terms
                </a>{" "}
                and{" "}
                <a href="#" className="text-red-600 hover:text-red-700 font-medium">
                  Privacy Policies
                </a>
              </label>
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
                {error}
              </div>
            )}

            {/* Next Button */}
            <Button
              type="submit"
              className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg text-base"
            >
              Next
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
          <Divider text="Or Sign up with" className="my-8" />

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

export default FarmerRegistrationPage;

