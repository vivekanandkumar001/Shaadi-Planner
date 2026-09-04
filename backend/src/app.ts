import express from "express"
import cors from "cors"
import helmet from "helmet"
import cookieParser from "cookie-parser"
import rateLimit from "express-rate-limit"
import { env } from "./config"
import { errorHandler } from "./middleware/error"

import authRoutes from "./routes/auth.routes"
import weddingRoutes from "./routes/wedding.routes"
import guestRoutes from "./routes/guest.routes"
import eventRoutes from "./routes/event.routes"
import budgetRoutes from "./routes/budget.routes"
import vendorRoutes from "./routes/vendor.routes"
import taskRoutes from "./routes/task.routes"
import seatingRoutes from "./routes/seating.routes"
import menuRoutes from "./routes/menu.routes"
import shagunRoutes from "./routes/shagun.routes"
import noteRoutes from "./routes/note.routes"
import shareRoutes from "./routes/share.routes"
import exportRoutes from "./routes/export.routes"
import searchRoutes from "./routes/search.routes"
import migrationRoutes from "./routes/migration.routes"

const app = express()

// Security headers
app.use(
  helmet({
    contentSecurityPolicy: false, // Vite / Frontend handles CSP
  })
)

// CORS configuration (no wildcard in production)
const allowedOrigins = [
  env.FRONTEND_URL ? env.FRONTEND_URL.replace(/\/$/, "") : "",
  "http://localhost:5173",
  "http://localhost:8443",
  "http://127.0.0.1:5173",
].filter(Boolean)

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true)
      const cleanOrigin = origin.replace(/\/$/, "")
      if (allowedOrigins.includes(cleanOrigin) || env.NODE_ENV === "development") {
        callback(null, true)
      } else {
        callback(new Error(`Not allowed by CORS: ${origin}`))
      }
    },
    credentials: true,
  })
)

// Body & Cookie Parsers
app.use(express.json({ limit: "5mb" }))
app.use(express.urlencoded({ extended: true, limit: "5mb" }))
app.use(cookieParser(env.COOKIE_SECRET))

// Rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per IP per window
  message: {
    success: false,
    error: {
      code: "TOO_MANY_REQUESTS",
      message: "Too many requests from this IP, please try again after 15 minutes.",
    },
  },
})

// Healthcheck endpoint (REQUIRED for Render)
app.get("/api/v1/health", (_req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() })
})

// Route Mounting
app.use("/api/v1/auth", authLimiter, authRoutes)
app.use("/api/v1/weddings", weddingRoutes)
app.use("/api/v1/guests", guestRoutes)
app.use("/api/v1/events", eventRoutes)
app.use("/api/v1/budget", budgetRoutes)
app.use("/api/v1/vendors", vendorRoutes)
app.use("/api/v1/tasks", taskRoutes)
app.use("/api/v1/seating", seatingRoutes)
app.use("/api/v1/menu", menuRoutes)
app.use("/api/v1/shagun", shagunRoutes)
app.use("/api/v1/notes", noteRoutes)
app.use("/api/v1/shares", shareRoutes)
app.use("/api/v1/exports", exportRoutes)
app.use("/api/v1/search", searchRoutes)
app.use("/api/v1/migration", migrationRoutes)

// 404 Handler
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: "NOT_FOUND",
      message: "API endpoint not found.",
    },
  })
})

// Global Centralized Error Middleware
app.use(errorHandler)

export default app
