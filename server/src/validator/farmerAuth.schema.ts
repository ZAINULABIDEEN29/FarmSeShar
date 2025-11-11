import {object, z} from "zod"



export const registerFarmerSchema = z.object({
  fullName: z.object({
        firstName: z.string().min(2, "First name is too short"),
        lastName: z.string().min(2, "Last name is too short"),
    }),
    cnic:z.string().min(13).max(13),
    email:z.string().email(),
    phoneNumber:z.string().regex(/^[0-9]{10,15}$/),
    farmName:z.string().min(2).max(40),
    farmLocation:z.string().min(2).max(40),
    farmDescription:z.string().min(2).max(40),
    accountHolderName:z.string().min(2).max(40),
    bankAccountNumber:z.string().min(2).max(40),
    password:z.string().min(8).max(40)

})

export const loginFarmerSchema = z.object({
    email:z.string().email(),
    password:z.string().min(8)

})

export const verifyCodeSchema = z.object({
    farmerId:z.string().min(1),
    code:z.string().min(6).max(6)
})

export const forgotPasswordSchema = z.object({
    email:z.string().email()
})

export const resetPasswordSchema = z.object({
    farmerId:z.string().min(1),
    token:z.string().min(1),
    newPassword:z.string().min(8)
})

export type RegisterFarmerInput = z.infer<typeof registerFarmerSchema>;
export type LoginFarmerInput = z.infer<typeof loginFarmerSchema>;
export type VerifyCodeInput = z.infer<typeof verifyCodeSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;