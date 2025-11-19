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
  // Create transporter
  const transporter = createTransporter();
  if (!transporter) {
    return {
      success: false,
      message: "Email service is not configured. Please contact support.",
    };
  }

  try {
    // Render email template
    const html = await render(<VerificationEmail username={username} otp={otp} />);
    
    // Email options
    const mailOptions = {
      from: `${getFromName()} <${getFromEmail()}>`,
      to: email,
      subject: "Your OTP Verification Code",
      html,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    
    console.log("✅ Verification email sent successfully to:", email);
    console.log("Message ID:", info.messageId);
    
    return {
      success: true,
      message: "Verification email sent successfully",
    };
  } catch (error: any) {
    console.error("❌ Error sending verification email:", error);
    const errorMessage = error?.message || error?.toString() || "Unknown error occurred";
    return {
      success: false,
      message: `Failed to send verification email: ${errorMessage}. Please check your email address and try again.`,
    };
  }
};
