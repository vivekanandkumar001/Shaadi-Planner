import { Router } from "express"
import { z } from "zod"
import { prisma } from "../db/prisma"
import { hashPassword, comparePassword } from "../utils/hash"
import { generateToken } from "../utils/jwt"
import { requireAuth, AuthRequest } from "../middleware/auth"
import { validate } from "../middleware/validate"

const router = Router()

const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    phone: z.string().optional(),
  }),
})

const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
  }),
})

const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email address"),
  }),
})

const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().min(1, "Token is required"),
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
  }),
})

// Register
router.post("/register", validate(registerSchema), async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body
    const normalizedEmail = email.toLowerCase().trim()

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    })

    if (existingUser) {
      res.status(409).json({
        success: false,
        error: {
          code: "EMAIL_EXISTS",
          message: "An account with this email already exists.",
        },
      })
      return
    }

    const passwordHash = await hashPassword(password)
    const user = await prisma.user.create({
      data: {
        name,
        email: normalizedEmail,
        passwordHash,
        phone: phone || null,
      },
    })

    // Create session token
    const token = generateToken({ userId: user.id, email: user.email, sessionId: "" })
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

    const session = await prisma.session.create({
      data: {
        token,
        userId: user.id,
        expiresAt,
      },
    })

    // Set HttpOnly Cookie
    res.cookie("session_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          isVerified: user.isVerified,
        },
        token,
      },
    })
  } catch (error) {
    next(error)
  }
})

// Login
router.post("/login", validate(loginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body
    const normalizedEmail = email.toLowerCase().trim()

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    })

    if (!user) {
      res.status(401).json({
        success: false,
        error: {
          code: "INVALID_CREDENTIALS",
          message: "Invalid email or password.",
        },
      })
      return
    }

    const validPassword = await comparePassword(password, user.passwordHash)
    if (!validPassword) {
      res.status(401).json({
        success: false,
        error: {
          code: "INVALID_CREDENTIALS",
          message: "Invalid email or password.",
        },
      })
      return
    }

    const token = generateToken({ userId: user.id, email: user.email, sessionId: "" })
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

    await prisma.session.create({
      data: {
        token,
        userId: user.id,
        expiresAt,
      },
    })

    res.cookie("session_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          isVerified: user.isVerified,
        },
        token,
      },
    })
  } catch (error) {
    next(error)
  }
})

// Logout
router.post("/logout", requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const token = req.cookies?.session_token
    if (token) {
      await prisma.session.deleteMany({ where: { token } })
    }

    res.clearCookie("session_token")
    res.json({ success: true, message: "Logged out successfully." })
  } catch (error) {
    next(error)
  }
})

// Get Current User
router.get("/me", requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        isVerified: true,
        createdAt: true,
      },
    })

    if (!user) {
      res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "User not found" } })
      return
    }

    res.json({ success: true, data: { user } })
  } catch (error) {
    next(error)
  }
})

// Forgot Password (Generic response to prevent user enumeration)
router.post("/forgot-password", validate(forgotPasswordSchema), async (req, res, next) => {
  try {
    const { email } = req.body
    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } })

    if (user) {
      const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
      await prisma.passwordResetToken.create({
        data: {
          token: resetToken,
          userId: user.id,
          expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
        },
      })
      // Note: In dev/production, email logging or provider dispatch happens here.
      console.log(`🔑 [DEV RESET TOKEN] For ${user.email}: ${resetToken}`)
    }

    res.json({
      success: true,
      message: "If an account with that email exists, password reset instructions have been sent.",
    })
  } catch (error) {
    next(error)
  }
})

// Reset Password
router.post("/reset-password", validate(resetPasswordSchema), async (req, res, next) => {
  try {
    const { token, newPassword } = req.body
    const resetEntry = await prisma.passwordResetToken.findUnique({
      where: { token },
      include: { user: true },
    })

    if (!resetEntry || resetEntry.expiresAt < new Date()) {
      res.status(400).json({
        success: false,
        error: { code: "INVALID_RESET_TOKEN", message: "Invalid or expired password reset token." },
      })
      return
    }

    const passwordHash = await hashPassword(newPassword)
    await prisma.user.update({
      where: { id: resetEntry.userId },
      data: { passwordHash },
    })

    // Invalidate all active sessions & delete reset token
    await prisma.session.deleteMany({ where: { userId: resetEntry.userId } })
    await prisma.passwordResetToken.delete({ where: { id: resetEntry.id } })

    res.json({ success: true, message: "Password updated successfully. Please log in with your new password." })
  } catch (error) {
    next(error)
  }
})

// Update Profile
router.put("/profile", requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const { name, phone } = req.body
    const user = await prisma.user.update({
      where: { id: req.userId },
      data: { name, phone },
      select: { id: true, name: true, email: true, phone: true },
    })

    res.json({ success: true, data: { user } })
  } catch (error) {
    next(error)
  }
})

// Delete Account
router.delete("/account", requireAuth, async (req: AuthRequest, res, next) => {
  try {
    await prisma.user.delete({
      where: { id: req.userId },
    })
    res.clearCookie("session_token")
    res.json({ success: true, message: "Account deleted successfully." })
  } catch (error) {
    next(error)
  }
})

export default router
