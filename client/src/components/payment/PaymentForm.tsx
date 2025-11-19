import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import FormField from "@/components/auth/FormField";
import type { PaymentMethod, CardPaymentDetails, PaymentData } from "@/types/payment.types";
import { cn } from "@/lib/utils";
import { CreditCard, Wallet } from "lucide-react";
interface PaymentFormProps {
  onSubmit: (paymentData: PaymentData) => void;
  initialPaymentMethod?: PaymentMethod;
  className?: string;
  isLoading?: boolean;
}
const cardValidationSchema = Yup.object({
  cardNumber: Yup.string()
    .required("Card number is required")
    .matches(/^\d{4}\s?\d{4}\s?\d{4}\s?\d{4}$/, "Invalid card number format (XXXX XXXX XXXX XXXX)"),
  cardHolderName: Yup.string()
    .min(3, "Card holder name must be at least 3 characters")
    .required("Card holder name is required"),
  expiryDate: Yup.string()
    .required("Expiry date is required")
    .matches(/^(0[1-9]|1[0-2])\/\d{2}$/, "Invalid expiry date format (MM/YY)"),
  cvv: Yup.string()
    .required("CVV is required")
    .matches(/^\d{3,4}$/, "CVV must be 3 or 4 digits"),
});
const PaymentForm: React.FC<PaymentFormProps> = ({
  onSubmit,
  initialPaymentMethod = "card",
  className,
  isLoading = false,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(initialPaymentMethod);
  const cardFormik = useFormik<CardPaymentDetails>({
    initialValues: {
      cardNumber: "",
      cardHolderName: "",
      expiryDate: "",
      cvv: "",
    },
    validationSchema: cardValidationSchema,
    onSubmit: (values) => {
      onSubmit({
        paymentMethod: "card",
        cardDetails: values,
      });
    },
    enableReinitialize: true,
  });
  const handlePaymentMethodChange = (method: PaymentMethod) => {
    setPaymentMethod(method);
    if (method === "cash") {
      cardFormik.resetForm();
    }
  };
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\s/g, "").replace(/\D/g, "");
    if (value.length > 0) {
      value = value.match(/.{1,4}/g)?.join(" ") || value;
    }
    cardFormik.setFieldValue("cardNumber", value);
  };
  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length >= 2) {
      value = value.substring(0, 2) + "/" + value.substring(2, 4);
    }
    cardFormik.setFieldValue("expiryDate", value);
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentMethod === "card") {
      cardFormik.handleSubmit();
    } else {
      onSubmit({
        paymentMethod: "cash",
      });
    }
  };
  const isFormValid = paymentMethod === "cash" || cardFormik.isValid;
  return (
    <form onSubmit={handleSubmit} className={cn("space-y-6", className)} noValidate>
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
        Payment Method
      </h2>
      {}
      <div className="space-y-3">
        {}
        <label
          className={cn(
            "flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all",
            paymentMethod === "card"
              ? "border-green-500 bg-green-50"
              : "border-gray-200 hover:border-gray-300 bg-white"
          )}
        >
          <input
            type="radio"
            name="paymentMethod"
            value="card"
            checked={paymentMethod === "card"}
            onChange={() => handlePaymentMethodChange("card")}
            className="w-4 h-4 text-green-500 border-gray-300 focus:ring-green-500"
          />
          <CreditCard className="h-5 w-5 text-gray-700" />
          <span className="flex-1 text-sm font-medium text-gray-900">
            Pay with Card
          </span>
        </label>
        {}
        <label
          className={cn(
            "flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all",
            paymentMethod === "cash"
              ? "border-green-500 bg-green-50"
              : "border-gray-200 hover:border-gray-300 bg-white"
          )}
        >
          <input
            type="radio"
            name="paymentMethod"
            value="cash"
            checked={paymentMethod === "cash"}
            onChange={() => handlePaymentMethodChange("cash")}
            className="w-4 h-4 text-green-500 border-gray-300 focus:ring-green-500"
          />
          <Wallet className="h-5 w-5 text-gray-700" />
          <span className="flex-1 text-sm font-medium text-gray-900">
            Cash on Delivery
          </span>
        </label>
      </div>
      {}
      {paymentMethod === "card" && (
        <div className="space-y-4 pt-4 border-t border-gray-200">
          <FormField
            label="Card Number"
            id="cardNumber"
            type="text"
            placeholder="1234 5678 9012 3456"
            value={cardFormik.values.cardNumber}
            onChange={handleCardNumberChange}
            onBlur={cardFormik.handleBlur}
            error={
              cardFormik.touched.cardNumber && cardFormik.errors.cardNumber
                ? cardFormik.errors.cardNumber
                : undefined
            }
            required
            inputClassName="tracking-widest"
          />
          <FormField
            label="Card Holder Name"
            id="cardHolderName"
            type="text"
            placeholder="John Doe"
            value={cardFormik.values.cardHolderName}
            onChange={cardFormik.handleChange}
            onBlur={cardFormik.handleBlur}
            error={
              cardFormik.touched.cardHolderName && cardFormik.errors.cardHolderName
                ? cardFormik.errors.cardHolderName
                : undefined
            }
            required
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              label="Expiry Date"
              id="expiryDate"
              type="text"
              placeholder="MM/YY"
              value={cardFormik.values.expiryDate}
              onChange={handleExpiryDateChange}
              onBlur={cardFormik.handleBlur}
              error={
                cardFormik.touched.expiryDate && cardFormik.errors.expiryDate
                  ? cardFormik.errors.expiryDate
                  : undefined
              }
              required
              inputClassName="uppercase"
            />
            <FormField
              label="CVV"
              id="cvv"
              type="text"
              placeholder="123"
              value={cardFormik.values.cvv}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "").substring(0, 4);
                cardFormik.setFieldValue("cvv", value);
              }}
              onBlur={cardFormik.handleBlur}
              error={
                cardFormik.touched.cvv && cardFormik.errors.cvv
                  ? cardFormik.errors.cvv
                  : undefined
              }
              required
            />
          </div>
        </div>
      )}
      {}
      {paymentMethod === "cash" && (
        <div className="pt-4 border-t border-gray-200">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              You will pay cash when your order is delivered. Please have the exact amount ready.
            </p>
          </div>
        </div>
      )}
      {}
      <div className="pt-4">
        <Button
          type="submit"
          disabled={isLoading || !isFormValid}
          className="w-full bg-green-500 text-white hover:bg-green-600 text-base sm:text-lg font-semibold py-6 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          size="lg"
        >
          {isLoading ? "Processing..." : "Continue & Place Order"}
        </Button>
      </div>
    </form>
  );
};
export default PaymentForm;
