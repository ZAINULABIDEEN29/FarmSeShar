import { resend } from "../utils/resend.js";
import { render } from "@react-email/render";
import ResetPasswordEmail from "../emails/resetPasswordEmail.js";
import type { EmailResult } from "./sendVerificationEmail.js";

export const sendResetPasswordEmail = async (email: string, username: string, resetLink: string):Promise<EmailResult> => {
  try {
    await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: email,
      subject: 'Reset Your Password',
      react: <ResetPasswordEmail username={username} resetLink={resetLink} />,
    });

    return { success: true, message: 'Reset password email sent' };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};
