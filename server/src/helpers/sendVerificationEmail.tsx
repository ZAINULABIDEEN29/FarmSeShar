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
  try {
    const html = await render(<VerificationEmail username={username} otp={otp} />);
    await resend.emails.send({
      from: "Acme <onboarding@resend.dev>", // must match your verified domain!
      to: email,
      subject: "Your OTP Verification Code",
      html,
    });
    return {
      success: true,
      message: "Verification email sent successfully",
    };
  } catch (error) {
    console.error("Error sending email", error);
    return {
            success: false,
            message: 'Failed to send verification email'
        }
      }
};
