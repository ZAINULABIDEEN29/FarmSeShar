import {  resend } from "../utils/resend.js";
import { render } from "@react-email/render";
import ResetPasswordEmail from "../emails/resetPasswordEmail.js";
import type { EmailResult } from "./sendVerificationEmail.js";

export const sendResetPasswordEmail = async (email: string, username: string, resetLink: string):Promise<EmailResult> => {
  try {
    const html = await render(
            <ResetPasswordEmail username={username} resetLink={resetLink} />
        );

        await resend.emails.send({
            from: "Acme <onboarding@resend.dev>",
            to: email,
            subject: "Reset Your Password",
            html,
        });

        return { success: true, message: "Reset email sent successfully" };
  } catch (error: any) {
        console.error("Error sending reset password email:", error);
        return { 
            success: false, 
            message: error?.message ?? "Failed to send reset password email" 
        };
      }
};
