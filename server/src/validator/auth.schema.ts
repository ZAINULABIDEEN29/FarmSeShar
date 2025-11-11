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

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
