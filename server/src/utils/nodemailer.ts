import nodemailer from "nodemailer";

interface SmtpConfig {
  service?: string;
  host?: string;
  port?: number;
  secure?: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

export const createTransporter = () => {
  // Check if SMTP configuration is provided
  if (
    !process.env.SMTP_MAIL ||
    !process.env.SMTP_PASSWORD ||
    (!process.env.SMTP_HOST && !process.env.SMTP_SERVICE)
  ) {
    console.error("❌ SMTP configuration is missing in environment variables");
    console.error("Required variables: SMTP_MAIL, SMTP_PASSWORD, and either SMTP_HOST+SMTP_PORT or SMTP_SERVICE");
    return null;
  }

  const config: SmtpConfig = {
    auth: {
      user: process.env.SMTP_MAIL!,
      pass: process.env.SMTP_PASSWORD!,
    },
  };

  // If SMTP_SERVICE is provided, use service configuration (recommended for Gmail, Outlook, etc.)
  if (process.env.SMTP_SERVICE) {
    config.service = process.env.SMTP_SERVICE;
  } else if (process.env.SMTP_HOST && process.env.SMTP_PORT) {
    // Otherwise, use host and port configuration
    config.host = process.env.SMTP_HOST;
    config.port = parseInt(process.env.SMTP_PORT, 10);
    // Secure connection for port 465 (SSL), otherwise TLS
    config.secure = process.env.SMTP_PORT === "465";
  } else {
    console.error("❌ SMTP configuration error: Either SMTP_SERVICE or SMTP_HOST+SMTP_PORT must be provided");
    return null;
  }

  // Create transporter
  const transporter = nodemailer.createTransport(config);

  return transporter;
};

export const verifyTransporter = async (transporter: nodemailer.Transporter): Promise<boolean> => {
  try {
    await transporter.verify();
    console.log("✅ SMTP server connection verified successfully");
    return true;
  } catch (error) {
    console.error("❌ SMTP server verification failed:", error);
    return false;
  }
};

export const getFromEmail = (): string => {
  return process.env.ADMIN_EMAIL || process.env.SMTP_MAIL || "noreply@example.com";
};

export const getFromName = (): string => {
  return "Farmers App";
};
