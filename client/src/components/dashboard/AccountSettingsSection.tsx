import React, { useState, useRef, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Camera, Loader2, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import FormField from "@/components/auth/FormField";
import { toast } from "react-toastify";
import { useUpdateFarmerProfile, useGetFarmerProfile } from "@/hooks/useFarmer";
import { uploadService } from "@/services/upload.service";
import { cn } from "@/lib/utils";

interface AccountSettingsSectionProps {
  className?: string;
}

const validationSchema = Yup.object({
  firstName: Yup.string()
    .min(2, "First name must be at least 2 characters")
    .max(40, "First name must be at most 40 characters")
    .required("First name is required"),
  lastName: Yup.string()
    .min(2, "Last name must be at least 2 characters")
    .max(40, "Last name must be at most 40 characters")
    .required("Last name is required"),
  phoneNumber: Yup.string()
    .matches(/^[0-9]{10,15}$/, "Enter valid phone number")
    .required("Phone number is required"),
  farmName: Yup.string()
    .min(2, "Farm name must be at least 2 characters")
    .required("Farm name is required"),
  farmLocation: Yup.string()
    .min(2, "Farm location must be at least 2 characters")
    .required("Farm location is required"),
  farmDescription: Yup.string()
    .min(10, "Farm description must be at least 10 characters")
    .required("Farm description is required"),
  accountHolderName: Yup.string()
    .min(2, "Account holder name must be at least 2 characters")
    .required("Account holder name is required"),
  bankAccountNumber: Yup.string()
    .min(2, "Bank account number must be at least 2 characters")
    .required("Bank account number is required"),
});

const AccountSettingsSection: React.FC<AccountSettingsSectionProps> = ({
  className,
}) => {
  const { data: farmerData, isLoading: isLoadingProfile } = useGetFarmerProfile();
  const updateProfileMutation = useUpdateFarmerProfile();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      farmName: "",
      farmLocation: "",
      farmDescription: "",
      accountHolderName: "",
      bankAccountNumber: "",
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        await updateProfileMutation.mutateAsync({
          ...values,
          profileImage: profileImage || undefined,
        });
      } catch (error) {
        // Error handling is done in the hook
      }
    },
  });

  // Update form values when farmer data loads
  useEffect(() => {
    if (farmerData?.farmer) {
      const farmer = farmerData.farmer;
      formik.setValues({
        firstName: farmer.fullName?.firstName || "",
        lastName: farmer.fullName?.lastName || "",
        phoneNumber: farmer.phoneNumber || "",
        farmName: farmer.farmName || "",
        farmLocation: farmer.farmLocation || "",
        farmDescription: farmer.farmDescription || "",
        accountHolderName: farmer.accountHolderName || "",
        bankAccountNumber: farmer.bankAccountNumber || "",
      });
      if (farmer.profileImage) {
        setProfileImage(farmer.profileImage);
      }
    }
  }, [farmerData]);

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    setIsUploadingImage(true);
    try {
      const response = await uploadService.uploadImage(file, "profile");
      setProfileImage(response.image.url);
      toast.success("Profile image uploaded successfully!");
    } catch (error: any) {
      console.error("Image upload error:", error);
      toast.error(error.response?.data?.message || "Failed to upload image. Please try again.");
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveImage = () => {
    setProfileImage(null);
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  if (isLoadingProfile) {
    return (
      <div className={cn("flex items-center justify-center py-12", className)}>
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-green-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
          Account Settings
        </h2>
        <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
          Manage your profile information and settings.
        </p>
      </div>

      {/* Profile Image Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
          Profile Picture
        </h3>
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative group">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-gray-100 border-4 border-gray-200 flex items-center justify-center">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-green-400 to-green-600">
                  <span className="text-2xl sm:text-3xl font-bold text-white">
                    {formik.values.firstName?.[0]?.toUpperCase() || "F"}
                    {formik.values.lastName?.[0]?.toUpperCase() || ""}
                  </span>
                </div>
              )}
            </div>
            {profileImage && (
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                aria-label="Remove image"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="flex-1 w-full sm:w-auto">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
            <div className="space-y-3">
              <Button
                type="button"
                onClick={handleImageClick}
                disabled={isUploadingImage}
                variant="outline"
                className="w-full sm:w-auto flex items-center gap-2"
              >
                {isUploadingImage ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Camera className="h-4 w-4" />
                    {profileImage ? "Change Photo" : "Upload Photo"}
                  </>
                )}
              </Button>
              <p className="text-xs sm:text-sm text-gray-500">
                JPG, PNG or GIF. Max size 5MB.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Information Form */}
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-6">
            Personal Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <FormField
                label="First Name"
                id="firstName"
                type="text"
                placeholder="John"
                value={formik.values.firstName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                required
              />
              {formik.touched.firstName && formik.errors.firstName && (
                <p className="text-sm text-red-600 mt-1">{formik.errors.firstName}</p>
              )}
            </div>
            <div>
              <FormField
                label="Last Name"
                id="lastName"
                type="text"
                placeholder="Doe"
                value={formik.values.lastName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                required
              />
              {formik.touched.lastName && formik.errors.lastName && (
                <p className="text-sm text-red-600 mt-1">{formik.errors.lastName}</p>
              )}
            </div>
            <div className="sm:col-span-2">
              <FormField
                label="Phone Number"
                id="phoneNumber"
                type="tel"
                placeholder="1234567890"
                value={formik.values.phoneNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                required
              />
              {formik.touched.phoneNumber && formik.errors.phoneNumber && (
                <p className="text-sm text-red-600 mt-1">{formik.errors.phoneNumber}</p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-6">
            Farm Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="sm:col-span-2">
              <FormField
                label="Farm Name"
                id="farmName"
                type="text"
                placeholder="Green Valley Farm"
                value={formik.values.farmName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                required
              />
              {formik.touched.farmName && formik.errors.farmName && (
                <p className="text-sm text-red-600 mt-1">{formik.errors.farmName}</p>
              )}
            </div>
            <div className="sm:col-span-2">
              <FormField
                label="Farm Location"
                id="farmLocation"
                type="text"
                placeholder="City, Province, Country"
                value={formik.values.farmLocation}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                required
              />
              {formik.touched.farmLocation && formik.errors.farmLocation && (
                <p className="text-sm text-red-600 mt-1">{formik.errors.farmLocation}</p>
              )}
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="farmDescription" className="block text-sm font-medium text-gray-700 mb-2">
                Farm Description
              </label>
              <textarea
                id="farmDescription"
                name="farmDescription"
                rows={4}
                value={formik.values.farmDescription}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Describe your farm, products, and farming practices..."
                className={cn(
                  "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors",
                  "text-sm sm:text-base",
                  formik.touched.farmDescription && formik.errors.farmDescription
                    ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                    : ""
                )}
                required
              />
              {formik.touched.farmDescription && formik.errors.farmDescription && (
                <p className="text-sm text-red-600 mt-1">{formik.errors.farmDescription}</p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-6">
            Bank Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="sm:col-span-2">
              <FormField
                label="Account Holder Name"
                id="accountHolderName"
                type="text"
                placeholder="John Doe"
                value={formik.values.accountHolderName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                required
              />
              {formik.touched.accountHolderName && formik.errors.accountHolderName && (
                <p className="text-sm text-red-600 mt-1">{formik.errors.accountHolderName}</p>
              )}
            </div>
            <div className="sm:col-span-2">
              <FormField
                label="Bank Account Number"
                id="bankAccountNumber"
                type="text"
                placeholder="1234567890123"
                value={formik.values.bankAccountNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                required
              />
              {formik.touched.bankAccountNumber && formik.errors.bankAccountNumber && (
                <p className="text-sm text-red-600 mt-1">{formik.errors.bankAccountNumber}</p>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4 pt-4">
          <Button
            type="submit"
            disabled={updateProfileMutation.isPending || isUploadingImage}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 text-base font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {updateProfileMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AccountSettingsSection;

