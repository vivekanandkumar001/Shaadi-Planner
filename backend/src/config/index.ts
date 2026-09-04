import dotenv from "dotenv"
import { z } from "zod"

dotenv.config()

const envSchema = z.object({
  PORT: z.string().default("5000"),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  FRONTEND_URL: z.string().default("http://localhost:5173"),
  BACKEND_URL: z.string().default("http://localhost:5000"),
  SESSION_SECRET: z.string().min(16, "SESSION_SECRET must be at least 16 characters"),
  COOKIE_SECRET: z.string().min(16, "COOKIE_SECRET must be at least 16 characters"),
  JWT_SECRET: z.string().min(16, "JWT_SECRET must be at least 16 characters"),
})

const parseResult = envSchema.safeParse(process.env)

if (!parseResult.success) {
  console.error("❌ Invalid environment variables:", parseResult.error.format())
  // Use safe defaults for dev if needed
}

export const env = parseResult.success
  ? parseResult.data
  : {
      PORT: process.env.PORT || "5000",
      NODE_ENV: (process.env.NODE_ENV as "development" | "production" | "test") || "development",
      DATABASE_URL: process.env.DATABASE_URL || "file:./dev.db",
      FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:5173",
      BACKEND_URL: process.env.BACKEND_URL || "http://localhost:5000",
      SESSION_SECRET: process.env.SESSION_SECRET || "default-session-secret-change-in-prod-min-32",
      COOKIE_SECRET: process.env.COOKIE_SECRET || "default-cookie-secret-change-in-prod",
      JWT_SECRET: process.env.JWT_SECRET || "default-jwt-secret-change-in-prod-min-32",
    }
