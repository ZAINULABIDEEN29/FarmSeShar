import { createTransporter, getFromEmail, getFromName } from "../utils/nodemailer.js";
import { render } from "@react-email/render";
import VerificationEmail from "../emails/verificationEmail.js";

export type EmailResult = {
  success: boolean;
  message: string;
};

export const sendVerificationEmail = async (
  email: string,
  username: string,
  otp: string
): Promise<EmailResult> => {
  const transporter = createTransporter();
  if (!transporter) {
    return {
      success: false,
      message: "Email service is not configured. Please contact support.",
    };
  }

  try {
    const html = await render(<VerificationEmail username={username} otp={otp} />);
    
    const mailOptions = {
      from: `${getFromName()} <${getFromEmail()}>`,
      to: email,
      subject: "Your OTP Verification Code",
      html,
    };

    await transporter.sendMail(mailOptions);
    
    return {
      success: true,
      message: "Verification email sent successfully",
    };
  } catch (error: any) {
   
    const errorMessage = error?.message || error?.toString() || "Unknown error occurred";
    return {
      success: false,
      message: `Failed to send verification email: ${errorMessage}. Please check your email address and try again.`,
    };
  }
};
