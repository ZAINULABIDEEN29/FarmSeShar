import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { AlertCircle, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Container from "@/components/container/Container";
import { cn } from "@/lib/utils";

interface ContactFormValues {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

const GetInTouch: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(2, "Name must be at least 2 characters")
      .required("Name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    phone: Yup.string()
      .required("Phone is required"),
    subject: Yup.string()
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

  const contactInfo = [
    {
      label: "Phone Number",
      value: "(111)-2347-1968",
      href: "tel:(111)-2347-1968",
    },
    {
      label: "Email Address",
      value: "localharvest@company.com",
      href: "mailto:localharvest@company.com",
    },
    {
      label: "Location",
      value: "Lahore, Punjab, Pakistan",
      href: undefined,
    },
  ];

  return (
    <section id="get-in-touch" className="py-16 sm:py-20 lg:py-24 xl:py-28 bg-white">
      <Container>
        {/* Centered heading */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <h2 className="text-3xl sm:text-3xl lg:text-4xl tracking-tight leading-0 font-semibold text-gray-900 mb-4">
            Get In Touch With Us
          </h2>
        </div>

        {/* Large white container with green header bar */}
        <div className="bg-white  shadow-sm overflow-hidden border border-gray-100 max-w-6xl mx-auto">
          {/* Vibrant green header bar */}
          <div className="bg-green-600 h-10 sm:h-5 lg:h-20"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Left Column - Contact Information */}
            <div className="bg-white p-8 sm:p-10 lg:p-12 xl:p-14 flex flex-col justify-center">
              <div className="space-y-8 sm:space-y-10 lg:space-y-12">
                {contactInfo.map((info, index) => (
                  <div key={index}>
                    {/* Bold dark gray label */}
                    <p className="text-base sm:text-lg font-bold text-gray-900 mb-2 sm:mb-3">
                      {info.label}
                    </p>
                    {/* Lighter gray value - regular weight */}
                    {info.href ? (
                      <a
                        href={info.href}
                        className="text-base sm:text-lg lg:text-xl text-gray-600 hover:text-green-600 transition-colors duration-200 font-normal"
                      >
                        {info.value}
                      </a>
                    ) : (
                      <p className="text-base sm:text-lg lg:text-xl text-gray-600 font-normal">
                        {info.value}
                      </p>
                    )}
                    {/* Separator line - not last item */}
                    {index < contactInfo.length - 1 && (
                      <div className="mt-8 sm:mt-10 lg:mt-12 border-t border-gray-200"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Contact Form with white background */}
            <div className="p-8 sm:p-10 lg:p-12 xl:p-14 bg-white">
              {/* Sub-heading */}
              <div className="mb-8 sm:mb-10">
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
                  Send us a message
                </h3>
                {/* Description text - lighter gray */}
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-normal">
                  Your questions matter to us. Send a message and we'll respond with care.
                </p>
              </div>

              <form onSubmit={formik.handleSubmit} className="space-y-5 sm:space-y-6">
                {/* First Row: Name and Email side-by-side */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                  {/* Name Field */}
                  <div className="space-y-2">
                    <label
                      htmlFor="name"
                      className="block text-sm font-normal text-gray-900"
                    >
                      Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="John Doe"
                      value={formik.values.name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={cn(
                        "w-full text-base text-gray-900 border-gray-300 rounded-lg",
                        "placeholder:text-gray-400",
                        "focus:border-green-500 focus:ring-green-500 focus:ring-1",
                        "transition-all duration-200",
                        formik.touched.name && formik.errors.name
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                          : ""
                      )}
                    />
                    {formik.touched.name && formik.errors.name && (
                      <div className="flex items-center gap-1.5 text-sm text-red-600">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        <span>{formik.errors.name}</span>
                      </div>
                    )}
                  </div>

                  {/* Email Field */}
                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="block text-sm font-normal text-gray-900"
                    >
                      Email <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="john@gmail.com"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={cn(
                        "w-full text-base text-gray-900 border-gray-300 rounded-lg",
                        "placeholder:text-gray-400",
                        "focus:border-green-500 focus:ring-green-500 focus:ring-1",
                        "transition-all duration-200",
                        formik.touched.email && formik.errors.email
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                          : ""
                      )}
                    />
                    {formik.touched.email && formik.errors.email && (
                      <div className="flex items-center gap-1.5 text-sm text-red-600">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        <span>{formik.errors.email}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Second Row: Phone and Subject side-by-side */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                  {/* Phone Field */}
                  <div className="space-y-2">
                    <label
                      htmlFor="phone"
                      className="block text-sm font-normal text-gray-900"
                    >
                      Phone <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="03005003455"
                      value={formik.values.phone}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={cn(
                        "w-full text-base text-gray-900 border-gray-300 rounded-lg",
                        "placeholder:text-gray-400",
                        "focus:border-green-500 focus:ring-green-500 focus:ring-1",
                        "transition-all duration-200",
                        formik.touched.phone && formik.errors.phone
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                          : ""
                      )}
                    />
                    {formik.touched.phone && formik.errors.phone && (
                      <div className="flex items-center gap-1.5 text-sm text-red-600">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        <span>{formik.errors.phone}</span>
                      </div>
                    )}
                  </div>

                  {/* Subject Field */}
                  <div className="space-y-2">
                    <label
                      htmlFor="subject"
                      className="block text-sm font-normal text-gray-900"
                    >
                      Subject <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      placeholder=""
                      value={formik.values.subject}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={cn(
                        "w-full text-base text-gray-900 border-gray-300 rounded-lg",
                        "placeholder:text-gray-400",
                        "focus:border-green-500 focus:ring-green-500 focus:ring-1",
                        "transition-all duration-200",
                        formik.touched.subject && formik.errors.subject
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                          : ""
                      )}
                    />
                    {formik.touched.subject && formik.errors.subject && (
                      <div className="flex items-center gap-1.5 text-sm text-red-600">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        <span>{formik.errors.subject}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Third Row: Message textarea full width */}
                <div className="space-y-2">
                  <label
                    htmlFor="message"
                    className="block text-sm font-normal text-gray-900"
                  >
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    placeholder=""
                    value={formik.values.message}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={cn(
                      "w-full px-4 py-3 text-base text-gray-900 border border-gray-300 rounded-lg",
                      "placeholder:text-gray-400",
                      "focus:outline-none focus:border-green-500 focus:ring-green-500 focus:ring-1",
                      "resize-none transition-all duration-200",
                      formik.touched.message && formik.errors.message
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : ""
                    )}
                  />
                  {formik.touched.message && formik.errors.message && (
                    <div className="flex items-center gap-1.5 text-sm text-red-600">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>{formik.errors.message}</span>
                    </div>
                  )}
                </div>

                {/* Submit Button - Centered */}
                <div className="flex justify-center pt-2">
                  <Button
                    type="submit"
                    disabled={isSubmitting || !formik.isValid}
                    className={cn(
                      "bg-green-600 hover:bg-green-700 text-white",
                      "px-8 sm:px-10 py-3 sm:py-4 text-base font-normal",
                      "rounded-lg transition-colors duration-200",
                      "disabled:opacity-50 disabled:cursor-not-allowed",
                      "border-none shadow-none"
                    )}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Sending...
                      </span>
                    ) : (
                      <span>Send Message</span>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default GetInTouch;
