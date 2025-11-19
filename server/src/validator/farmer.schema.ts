import { z } from "zod";

export const updateFarmerProfileSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters").max(40, "First name must be at most 40 characters").optional(),
  lastName: z.string().min(2, "Last name must be at least 2 characters").max(40, "Last name must be at most 40 characters").optional(),
  phoneNumber: z.string().regex(/^[0-9]{10,15}$/, "Enter valid phone number").optional(),
  farmName: z.string().min(2, "Farm name must be at least 2 characters").optional(),
  farmLocation: z.string().min(2, "Farm location must be at least 2 characters").optional(),
  farmDescription: z.string().min(2, "Farm description must be at least 2 characters").optional(),
  accountHolderName: z.string().min(2, "Account holder name must be at least 2 characters").optional(),
  bankAccountNumber: z.string().min(2, "Bank account number must be at least 2 characters").optional(),
  profileImage: z.string().url("Must be a valid URL").optional(),
});

export type UpdateFarmerProfileInput = z.infer<typeof updateFarmerProfileSchema>;

