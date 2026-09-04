import { describe, it, expect } from "vitest"
import { hashPassword, comparePassword } from "../backend/src/utils/hash"
import { generateToken, verifyToken } from "../backend/src/utils/jwt"

describe("Authentication & Password Security Tests", () => {
  it("hashes passwords and verifies correctly with bcrypt", async () => {
    const rawPassword = "SuperSecretPassword123!"
    const hash = await hashPassword(rawPassword)

    expect(hash).not.toBe(rawPassword)
    expect(await comparePassword(rawPassword, hash)).toBe(true)
    expect(await comparePassword("WrongPassword", hash)).toBe(false)
  })

  it("generates and verifies JWT session tokens", () => {
    const payload = { userId: "user-123", email: "test@example.com", sessionId: "sess-456" }
    const token = generateToken(payload, "1h")

    expect(token).toBeTypeOf("string")
    const verified = verifyToken(token)
    expect(verified).not.toBeNull()
    expect(verified?.userId).toBe("user-123")
    expect(verified?.email).toBe("test@example.com")
  })

  it("rejects invalid or tampered tokens", () => {
    const tampered = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalidtoken.signature"
    expect(verifyToken(tampered)).toBeNull()
  })
})
