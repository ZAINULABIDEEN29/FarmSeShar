import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface ContactFormValues {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

const ContactForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(2, "Name must be at least 2 characters")
      .required("Name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    phone: Yup.string()
      .matches(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/, "Invalid phone number")
      .required("Phone is required"),
    subject: Yup.string()
      .min(5, "Subject must be at least 5 characters")
      .required("Subject is required"),
    message: Yup.string()
      .min(10, "Message must be at least 10 characters")
      .required("Message is required"),
  });

  const formik = useFormik<ContactFormValues>({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      setIsSubmitting(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        console.log("Contact form submitted:", values);
        toast.success("Thank you! Your message has been sent successfully.");
        resetForm();
      } catch (error) {
        toast.error("Failed to send message. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <div className="bg-white p-6 sm:p-8 lg:p-10 rounded-2xl shadow-lg border border-gray-200 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-linear-to-br from-green-100 to-emerald-100 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-linear-to-tr from-blue-100 to-purple-100 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2 opacity-50" />

      <div className="relative">
        <div className="flex items-center gap-3 mb-6 sm:mb-8">
          <div className="p-3 bg-linear-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
            <Send className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Send us a Message
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Fill out the form below and we'll get back to you soon
            </p>
          </div>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-5 sm:space-y-6">
          {/* Name and Email Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-gray-700"
              >
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={cn(
                    "w-full transition-all duration-200",
                    formik.touched.name && formik.errors.name
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:border-green-500 focus:ring-green-500"
                  )}
                />
                {formik.touched.name && !formik.errors.name && (
                  <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" />
                )}
              </div>
              {formik.touched.name && formik.errors.name && (
                <div className="flex items-center gap-1.5 text-sm text-red-600">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{formik.errors.name}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700"
              >
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={cn(
                    "w-full transition-all duration-200",
                    formik.touched.email && formik.errors.email
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:border-green-500 focus:ring-green-500"
                  )}
                />
                {formik.touched.email && !formik.errors.email && (
                  <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" />
                )}
              </div>
              {formik.touched.email && formik.errors.email && (
                <div className="flex items-center gap-1.5 text-sm text-red-600">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{formik.errors.email}</span>
                </div>
              )}
            </div>
          </div>

          {/* Phone and Subject Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
            <div className="space-y-2">
              <label
                htmlFor="phone"
                className="block text-sm font-semibold text-gray-700"
              >
                Phone Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+92 300 1234567"
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={cn(
                    "w-full transition-all duration-200",
                    formik.touched.phone && formik.errors.phone
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:border-green-500 focus:ring-green-500"
                  )}
                />
                {formik.touched.phone && !formik.errors.phone && (
                  <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" />
                )}
              </div>
              {formik.touched.phone && formik.errors.phone && (
                <div className="flex items-center gap-1.5 text-sm text-red-600">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{formik.errors.phone}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="subject"
                className="block text-sm font-semibold text-gray-700"
              >
                Subject <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Input
                  id="subject"
                  name="subject"
                  type="text"
                  placeholder="How can we help?"
                  value={formik.values.subject}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={cn(
                    "w-full transition-all duration-200",
                    formik.touched.subject && formik.errors.subject
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:border-green-500 focus:ring-green-500"
                  )}
                />
                {formik.touched.subject && !formik.errors.subject && (
                  <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" />
                )}
              </div>
              {formik.touched.subject && formik.errors.subject && (
                <div className="flex items-center gap-1.5 text-sm text-red-600">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{formik.errors.subject}</span>
                </div>
              )}
            </div>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <label
              htmlFor="message"
              className="block text-sm font-semibold text-gray-700"
            >
              Message <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <textarea
                id="message"
                name="message"
                rows={6}
                placeholder="Tell us more about your inquiry..."
                value={formik.values.message}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={cn(
                  "w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 resize-none text-sm sm:text-base transition-all duration-200",
                  formik.touched.message && formik.errors.message
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-green-500 focus:ring-green-500"
                )}
              />
              {formik.touched.message && !formik.errors.message && (
                <CheckCircle2 className="absolute right-3 top-3 h-5 w-5 text-green-500" />
              )}
            </div>
            {formik.touched.message && formik.errors.message && (
              <div className="flex items-center gap-1.5 text-sm text-red-600">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{formik.errors.message}</span>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <Button
              type="submit"
              disabled={isSubmitting || !formik.isValid}
              className="w-full sm:w-auto min-w-[200px] bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-6 text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Sending...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Send className="h-5 w-5" />
                  Send Message
                </span>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;

