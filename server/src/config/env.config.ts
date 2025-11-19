import dotenv from "dotenv";
dotenv.config();
interface EnvConfig {
  PORT: string;
  NODE_ENV: string;
  MONGO_URI: string;
  CLIENT_URL: string;
  JWT_SECRET: string;
  JWT_REFRESH_SECRET: string;
  RESEND_API_KEY?: string;
  STRIPE_SECRET_KEY?: string;
  STRIPE_WEBHOOK_SECRET?: string;
  STRIPE_PUBLISHABLE_KEY?: string;
  CLOUDINARY_CLOUD_NAME?: string;
  CLOUDINARY_API_KEY?: string;
  CLOUDINARY_API_SECRET?: string;
}
const requiredEnvVars: (keyof EnvConfig)[] = [
  "PORT",
  "NODE_ENV",
  "MONGO_URI",
  "CLIENT_URL",
  "JWT_SECRET",
  "JWT_REFRESH_SECRET",
];
const optionalEnvVars: Record<string, string> = {
  JWT_ACCESS_EXPIRY: "15m",
  JWT_REFRESH_EXPIRY: "7d",
};
export const validateEnv = (): void => {
  const missingVars: string[] = [];
  requiredEnvVars.forEach((varName) => {
    if (!process.env[varName]) {
      missingVars.push(varName);
    }
  });
  Object.entries(optionalEnvVars).forEach(([key, defaultValue]) => {
    if (!process.env[key]) {
      process.env[key] = defaultValue;
    }
  });
  if (missingVars.length > 0) {
    const errorMessage = `Missing required environment variables: ${missingVars.join(", ")}`;
    console.error("❌ Environment Validation Error:");
    console.error(errorMessage);
    console.error("\nPlease set these variables in your .env file.");
    throw new Error(errorMessage);
  }
  console.log("✅ Environment variables validated successfully");
};
export const env: EnvConfig = {
  PORT: process.env.PORT || "5000",
  NODE_ENV: process.env.NODE_ENV || "development",
  MONGO_URI: process.env.MONGO_URI!,
  CLIENT_URL: process.env.CLIENT_URL!,
  JWT_SECRET: process.env.JWT_SECRET!,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
  STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
};
validateEnv();
