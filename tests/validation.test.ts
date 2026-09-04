import { describe, it, expect } from "vitest"
import { z } from "zod"

// Zod schemas matching backend rules
const emailSchema = z.string().email()
const positiveNumberSchema = z.number().min(0)
const tableCapacitySchema = z.object({
  capacity: z.number().min(1),
  currentGuests: z.number(),
})

describe("Backend & Security Validation Tests", () => {
  it("validates correct email formats", () => {
    expect(emailSchema.safeParse("user@example.com").success).toBe(true)
    expect(emailSchema.safeParse("invalid-email").success).toBe(false)
  })

  it("rejects negative expense & budget amounts", () => {
    expect(positiveNumberSchema.safeParse(5000).success).toBe(true)
    expect(positiveNumberSchema.safeParse(-100).success).toBe(false)
  })

  it("prevents table capacity overflow", () => {
    const isFull = (data: { capacity: number; currentGuests: number }) => data.currentGuests >= data.capacity

    expect(isFull({ capacity: 8, currentGuests: 5 })).toBe(false)
    expect(isFull({ capacity: 8, currentGuests: 8 })).toBe(true)
    expect(isFull({ capacity: 8, currentGuests: 9 })).toBe(true)
  })
})
