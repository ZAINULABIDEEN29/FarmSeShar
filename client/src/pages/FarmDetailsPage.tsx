import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormField from "@/components/auth/FormField";
import TextAreaField from "@/components/auth/TextAreaField";
import { Button } from "@/components/ui/button";
import StepIndicator from "@/components/auth/StepIndicator";

const FarmDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const [farmName, setFarmName] = useState("General Farm");
  const [farmLocation, setFarmLocation] = useState("");
  const [farmDescription, setFarmDescription] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!farmName || !farmLocation || !farmDescription) {
      setError("Please fill in all required fields");
      return;
    }

    // Handle farm details logic here
    console.log("Farm Details:", {
      farmName,
      farmLocation,
      farmDescription,
    });

    // Navigate to next step (Step 3 of 3)
    navigate("/bank-details");
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Section - Farm Details Form */}
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
            currentStep={2}
            totalSteps={3}
            backTo="/farmer-registration"
          />

          {/* Heading */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            Farm Details
          </h1>
          <p className="text-sm sm:text-base text-gray-500 mb-6 lg:mb-8">
            This information showcases your farm and products to our buyers.
          </p>

          {/* Farm Details Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Farm Name */}
            <FormField
              label="Farm Name"
              id="farm-name"
              type="text"
              placeholder="General Farm"
              value={farmName}
              onChange={(e) => {
                setFarmName(e.target.value);
                setError("");
              }}
              required
            />

            {/* Farm Location */}
            <FormField
              label="Farm Location"
              id="farm-location"
              type="text"
              placeholder="Enter your farm location"
              value={farmLocation}
              onChange={(e) => {
                setFarmLocation(e.target.value);
                setError("");
              }}
              required
            />

            {/* Farm Description */}
            <TextAreaField
              label="Farm Description"
              id="farm-description"
              placeholder="Describe your farm, products, and farming practices..."
              value={farmDescription}
              onChange={(e) => {
                setFarmDescription(e.target.value);
                setError("");
              }}
              required
              rows={6}
            />

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
        </div>
      </div>

      {/* Right Section - Grey Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gray-100 rounded-l-3xl items-center justify-center p-6 xl:p-8">
        <div className="w-full max-w-xl h-[600px] rounded-2xl bg-gray-200" />
      </div>
    </div>
  );
};

export default FarmDetailsPage;

