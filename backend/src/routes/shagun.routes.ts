import { Router } from "express"
import { z } from "zod"
import { prisma } from "../db/prisma"
import { requireAuth, requireWeddingOwner, AuthRequest } from "../middleware/auth"
import { validate } from "../middleware/validate"

const router = Router()

const shagunSchema = z.object({
  body: z.object({
    guestName: z.string().min(1, "Guest name is required"),
    amount: z.number().min(0, "Amount must be positive").default(0),
    type: z.enum(["cash", "cheque", "gift", "online"]).default("cash"),
    description: z.string().optional(),
    date: z.string().optional(),
  }),
})

// List shagun
router.get("/:weddingId", requireAuth, requireWeddingOwner, async (req: AuthRequest, res, next) => {
  try {
    const entries = await prisma.shagunEntry.findMany({
      where: { weddingId: req.weddingId },
      orderBy: { createdAt: "desc" },
    })

    const formatted = entries.map((e) => ({
      ...e,
      amount: Number(e.amount),
    }))

    const totalAmount = formatted.reduce((acc, e) => acc + e.amount, 0)

    res.json({ success: true, data: { entries: formatted, totalAmount } })
  } catch (error) {
    next(error)
  }
})

// Add shagun entry
router.post("/:weddingId", requireAuth, requireWeddingOwner, validate(shagunSchema), async (req: AuthRequest, res, next) => {
  try {
    const data = req.body
    const entry = await prisma.shagunEntry.create({
      data: {
        weddingId: req.weddingId!,
        guestName: data.guestName,
        amount: data.amount,
        type: data.type,
        description: data.description || "",
        date: data.date || new Date().toISOString().split("T")[0],
      },
    })

    res.status(201).json({
      success: true,
      data: {
        entry: {
          ...entry,
          amount: Number(entry.amount),
        },
      },
    })
  } catch (error) {
    next(error)
  }
})

// Update shagun entry
router.put("/:weddingId/:id", requireAuth, requireWeddingOwner, async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params
    const data = req.body

    const updated = await prisma.shagunEntry.update({
      where: { id },
      data: {
        guestName: data.guestName,
        amount: data.amount,
        type: data.type,
        description: data.description,
        date: data.date,
      },
    })

    res.json({
      success: true,
      data: {
        entry: {
          ...updated,
          amount: Number(updated.amount),
        },
      },
    })
  } catch (error) {
    next(error)
  }
})

// Delete shagun entry
router.delete("/:weddingId/:id", requireAuth, requireWeddingOwner, async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params
    await prisma.shagunEntry.delete({ where: { id } })
    res.json({ success: true, message: "Shagun entry deleted." })
  } catch (error) {
    next(error)
  }
})

export default router
