import React from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import FormField from "@/components/auth/FormField";
import { Button } from "@/components/ui/button";
import SocialLoginButton from "@/components/auth/SocialLoginButton";
import Divider from "@/components/auth/Divider";
import BackLink from "@/components/auth/BackLink";
import { useForgotPasswordFarmer } from "@/hooks/useAuth";

const validationSchema = Yup.object({
  email: Yup.string().email("Invalid email address").required("Email is required"),
});

const FarmerForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const forgotPasswordMutation = useForgotPasswordFarmer();

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema,
    onSubmit: (values) => {
      forgotPasswordMutation.mutate({ email: values.email });
    },
  });

  const handleSocialLogin = (provider: "facebook" | "google" | "apple") => {
    console.log(`Login with ${provider}`);
  };

  return (
    <div className="min-h-screen bg-white flex">
      <div className="w-full lg:w-1/2 flex flex-col px-4 sm:px-6 lg:px-8 xl:px-10 py-6 sm:py-8 lg:py-10">
        <div className="max-w-sm w-full mx-auto lg:mx-0">
          <div className="mb-4 lg:mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 shrink-0" />
              <span className="text-xl font-bold text-gray-900">LocalHarvest</span>
            </div>
          </div>

          <BackLink to="/farmer-login" />

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            Forgot your password?
          </h1>
          <p className="text-sm sm:text-base text-gray-500 mb-6 lg:mb-8">
            Enter your email below to recover your password
          </p>

          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div>
              <FormField
                label="Email"
                id="email"
                type="email"
                placeholder="farmer@example.com"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                required
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-sm text-red-600 mt-1">{formik.errors.email}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={forgotPasswordMutation.isPending}
              className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {forgotPasswordMutation.isPending ? "Sending..." : "Submit"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-sm text-gray-600">
              Remember your password?{" "}
              <button
                onClick={() => navigate("/farmer-login")}
                className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
              >
                Back to Login
              </button>
            </span>
          </div>

          <Divider text="Or login with" className="my-8" />

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

      <div className="hidden lg:flex lg:w-1/2 bg-gray-100 rounded-l-3xl items-center justify-center p-6 xl:p-8">
        <div className="w-full max-w-xl h-[600px] rounded-2xl bg-gray-200" />
      </div>
    </div>
  );
};

export default FarmerForgotPasswordPage;

