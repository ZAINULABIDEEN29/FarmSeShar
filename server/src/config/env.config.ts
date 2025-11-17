import dotenv from "dotenv";

// Load environment variables
dotenv.config();

interface EnvConfig {
  PORT: string;
  NODE_ENV: string;
  MONGO_URI: string;
  CLIENT_URL: string;
  JWT_SECRET: string;
  JWT_REFRESH_SECRET: string;
//   JWT_ACCESS_EXPIRY?: string;
//   JWT_REFRESH_EXPIRY?: string;
  RESEND_API_KEY?: string;
//   EMAIL_FROM?: string;
  // Stripe Configuration (optional - only needed for card payments)
  STRIPE_SECRET_KEY?: string;
  STRIPE_WEBHOOK_SECRET?: string;
  STRIPE_PUBLISHABLE_KEY?: string;
}

// Required environment variables
const requiredEnvVars: (keyof EnvConfig)[] = [
  "PORT",
  "NODE_ENV",
  "MONGO_URI",
  "CLIENT_URL",
  "JWT_SECRET",
  "JWT_REFRESH_SECRET",
];

// Note: Stripe keys are optional - only needed if you want card payment support
// Cash payments work without Stripe

// Optional environment variables with defaults
const optionalEnvVars: Record<string, string> = {
  JWT_ACCESS_EXPIRY: "15m",
  JWT_REFRESH_EXPIRY: "7d",
};

/**
 * Validates that all required environment variables are set
 */
export const validateEnv = (): void => {
  const missingVars: string[] = [];

  // Check required variables
  requiredEnvVars.forEach((varName) => {
    if (!process.env[varName]) {
      missingVars.push(varName);
    }
  });

  // Set optional variables with defaults if not provided
  Object.entries(optionalEnvVars).forEach(([key, defaultValue]) => {
    if (!process.env[key]) {
      process.env[key] = defaultValue;
    }
  });

  // If there are missing required variables, throw an error
  if (missingVars.length > 0) {
    const errorMessage = `Missing required environment variables: ${missingVars.join(", ")}`;
    console.error("❌ Environment Validation Error:");
    console.error(errorMessage);
    console.error("\nPlease set these variables in your .env file.");
    throw new Error(errorMessage);
  }

  console.log("✅ Environment variables validated successfully");
};

// Export environment variables with type safety
export const env: EnvConfig = {
  PORT: process.env.PORT || "5000",
  NODE_ENV: process.env.NODE_ENV || "development",
  MONGO_URI: process.env.MONGO_URI!,
  CLIENT_URL: process.env.CLIENT_URL!,
  JWT_SECRET: process.env.JWT_SECRET!,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!,
//   JWT_ACCESS_EXPIRY: process.env.JWT_ACCESS_EXPIRY || "15m",
//   JWT_REFRESH_EXPIRY: process.env.JWT_REFRESH_EXPIRY || "7d",
  RESEND_API_KEY: process.env.RESEND_API_KEY,
//   EMAIL_FROM: process.env.EMAIL_FROM,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
  STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY,
};

// Validate environment on module load
validateEnv();

