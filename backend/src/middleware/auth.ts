import { Request, Response, NextFunction } from "express"
import { verifyToken } from "../utils/jwt"
import { prisma } from "../db/prisma"

export interface AuthRequest extends Request {
  userId?: string
  userEmail?: string
  sessionId?: string
  weddingId?: string
}

export async function requireAuth(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  const token = req.cookies?.session_token || req.headers.authorization?.replace("Bearer ", "")

  if (!token) {
    res.status(401).json({
      success: false,
      error: {
        code: "UNAUTHORIZED",
        message: "Authentication required. Please log in.",
      },
    })
    return
  }

  const payload = verifyToken(token)
  if (!payload) {
    res.status(401).json({
      success: false,
      error: {
        code: "INVALID_TOKEN",
        message: "Session expired or invalid token.",
      },
    })
    return
  }

  // Check active session in DB
  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: true },
  })

  if (!session || session.expiresAt < new Date()) {
    res.status(401).json({
      success: false,
      error: {
        code: "SESSION_EXPIRED",
        message: "Session has expired. Please log in again.",
      },
    })
    return
  }

  req.userId = session.userId
  req.userEmail = session.user.email
  req.sessionId = session.id
  next()
}

export async function requireWeddingOwner(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  const userId = req.userId
  const weddingId = (req.params.weddingId || req.params.id || req.body.weddingId || req.query.weddingId) as string

  if (!userId) {
    res.status(401).json({
      success: false,
      error: { code: "UNAUTHORIZED", message: "User not authenticated." },
    })
    return
  }

  if (!weddingId) {
    res.status(400).json({
      success: false,
      error: { code: "MISSING_WEDDING_ID", message: "Wedding ID is required." },
    })
    return
  }

  const wedding = await prisma.wedding.findFirst({
    where: {
      id: weddingId,
      userId: userId,
    },
  })

  if (!wedding) {
    res.status(404).json({
      success: false,
      error: { code: "NOT_FOUND", message: "Wedding not found or access denied." },
    })
    return
  }

  req.weddingId = wedding.id
  next()
}
