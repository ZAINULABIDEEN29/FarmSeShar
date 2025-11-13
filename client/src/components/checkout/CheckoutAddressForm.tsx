import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import FormField from "@/components/auth/FormField";
import type { CheckoutAddress } from "@/types/checkout.types";
import { cn } from "@/lib/utils";

interface CheckoutAddressFormProps {
  onSubmit: (address: CheckoutAddress) => void;
  initialValues?: Partial<CheckoutAddress>;
  className?: string;
  isLoading?: boolean;
}

const validationSchema = Yup.object({
  streetAddress: Yup.string()
    .min(5, "Street address must be at least 5 characters")
    .required("Street address is required"),
  houseNo: Yup.string().required("House number is required"),
  town: Yup.string()
    .min(2, "Town must be at least 2 characters")
    .required("Town is required"),
  city: Yup.string()
    .min(2, "City must be at least 2 characters")
    .required("City is required"),
  country: Yup.string()
    .min(2, "Country must be at least 2 characters")
    .required("Country is required"),
  postalCode: Yup.string()
    .min(4, "Postal code must be at least 4 characters")
    .max(10, "Postal code must not exceed 10 characters")
    .required("Postal code is required"),
});

const CheckoutAddressForm: React.FC<CheckoutAddressFormProps> = ({
  onSubmit,
  initialValues,
  className,
  isLoading = false,
}) => {
  const formik = useFormik<CheckoutAddress>({
    initialValues: {
      streetAddress: initialValues?.streetAddress || "",
      houseNo: initialValues?.houseNo || "",
      town: initialValues?.town || "",
      city: initialValues?.city || "",
      country: initialValues?.country || "",
      postalCode: initialValues?.postalCode || "",
    },
    validationSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  return (
    <form
      onSubmit={formik.handleSubmit}
      className={cn("space-y-6", className)}
      noValidate
    >
      <div className="space-y-6">
        {/* Street Address */}
        <FormField
          label="Street Address"
          id="streetAddress"
          type="text"
          placeholder="Enter street address"
          value={formik.values.streetAddress}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.streetAddress && formik.errors.streetAddress
              ? formik.errors.streetAddress
              : undefined
          }
          required
        />

        {/* House Number */}
        <FormField
          label="House Number"
          id="houseNo"
          type="text"
          placeholder="Enter house number"
          value={formik.values.houseNo}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.houseNo && formik.errors.houseNo
              ? formik.errors.houseNo
              : undefined
          }
          required
        />

        {/* Town and City - Side by side on larger screens */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <FormField
            label="Town"
            id="town"
            type="text"
            placeholder="Enter town"
            value={formik.values.town}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.town && formik.errors.town
                ? formik.errors.town
                : undefined
            }
            required
          />

          <FormField
            label="City"
            id="city"
            type="text"
            placeholder="Enter city"
            value={formik.values.city}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.city && formik.errors.city
                ? formik.errors.city
                : undefined
            }
            required
          />
        </div>

        {/* Country and Postal Code - Side by side on larger screens */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <FormField
            label="Country"
            id="country"
            type="text"
            placeholder="Enter country"
            value={formik.values.country}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.country && formik.errors.country
                ? formik.errors.country
                : undefined
            }
            required
          />

          <FormField
            label="Postal Code"
            id="postalCode"
            type="text"
            placeholder="Enter postal code"
            value={formik.values.postalCode}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.postalCode && formik.errors.postalCode
                ? formik.errors.postalCode
                : undefined
            }
            required
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-4">
        <Button
          type="submit"
          disabled={isLoading || !formik.isValid}
          className="w-full bg-green-500 text-white hover:bg-green-600 text-base sm:text-lg font-semibold py-6 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          size="lg"
        >
          {isLoading ? "Processing..." : "Place Order"}
        </Button>
      </div>
    </form>
  );
};

export default CheckoutAddressForm;

