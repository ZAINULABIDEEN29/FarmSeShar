import { z } from "zod";

export const registerSchema = z.object({
  fullName: z.object({
    firstName: z.string().min(2).max(40),
    lastName: z.string().min(2).max(40),
  }),
  email: z.string().email(),
  phoneNumber: z.string().regex(/^[0-9]{10,15}$/),
  password: z.string().min(8).max(40),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const resetPasswordSchema = z.object({
  userId: z.string().min(1),
  token: z.string().min(1),
  newPassword: z.string().min(8),
});

export const verifyCode = z.object({
  userId:z.string(),
  otp:z.string().min(6).max(6)
})

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type VerifyCodeInput = z.infer<typeof verifyCode>
