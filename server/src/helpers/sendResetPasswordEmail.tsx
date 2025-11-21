import { createTransporter, getFromEmail, getFromName } from "../utils/nodemailer.js";
import { render } from "@react-email/render";
import ResetPasswordEmail from "../emails/resetPasswordEmail.js";
import type { EmailResult } from "./sendVerificationEmail.js";

export const sendResetPasswordEmail = async (
  email: string,
  username: string,
  resetLink: string
): Promise<EmailResult> => {
  const transporter = createTransporter();
  if (!transporter) {
    return {
      success: false,
      message: "Email service is not configured. Please contact support.",
    };
  }

  try {
    const html = await render(<ResetPasswordEmail username={username} resetLink={resetLink} />);
    
    const mailOptions = {
      from: `${getFromName()} <${getFromEmail()}>`,
      to: email,
      subject: "Reset Your Password",
      html,
    };

    await transporter.sendMail(mailOptions);
    
    return { success: true, message: "Reset email sent successfully" };
  } catch (error: any) {
    const errorMessage = error?.message || error?.toString() || "Unknown error occurred";
    return {
      success: false,
      message: errorMessage || "Failed to send reset password email",
    };
  }
};
