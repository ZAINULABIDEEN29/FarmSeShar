import { resend } from "../utils/resend.js";
import { render } from "@react-email/render";
import VerificationEmail from "../emails/verificationEmail.js";
export type EmailResult = {
  success: boolean;
  message: string;
}
export const sendVerificationEmail = async (
  email: string,
  username: string,
  otp: string
):Promise<EmailResult> => {
  // Check if RESEND_API_KEY is configured
  if (!process.env.RESEND_API_KEY) {
    console.error(" RESEND_API_KEY is not configured in environment variables");
    return {
      success: false,
      message: "Email service is not configured. Please contact support."
    };
  }

  try {
    const html = await render(<VerificationEmail username={username} otp={otp} />);
    const result = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>", // must match your verified domain!
      to: email,
      subject: "Your OTP Verification Code",
      html,
    });

    if (result.error) {
      console.error("❌ Resend API Error:", result.error);
      return {
        success: false,
        message: result.error.message || "Failed to send verification email. Please try again."
      };
    }

    console.log("✅ Verification email sent successfully to:", email);
    return {
      success: true,
      message: "Verification email sent successfully",
    };
  } catch (error: any) {
    console.error("❌ Error sending verification email:", error);
    const errorMessage = error?.message || error?.toString() || "Unknown error occurred";
    return {
      success: false,
      message: `Failed to send verification email: ${errorMessage}. Please check your email address and try again.`
    };
  }
};
