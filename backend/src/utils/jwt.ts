import jwt from "jsonwebtoken"
import { env } from "../config/index"

export interface UserTokenPayload {
  userId: string
  email: string
  sessionId: string
}

export function generateToken(payload: UserTokenPayload, expiresIn: string = "7d"): string {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: expiresIn as any })
}

export function verifyToken(token: string): UserTokenPayload | null {
  try {
    return jwt.verify(token, env.JWT_SECRET) as UserTokenPayload
  } catch {
    return null
  }
}
