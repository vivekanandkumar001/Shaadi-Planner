import { Router } from "express"
import { z } from "zod"
import { prisma } from "../db/prisma"
import { requireAuth, requireWeddingOwner, AuthRequest } from "../middleware/auth"
import { validate } from "../middleware/validate"

const router = Router()

const functionSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required"),
    hindiName: z.string().optional(),
    date: z.string().optional(),
    time: z.string().optional(),
    venue: z.string().optional(),
    dresscode: z.string().optional(),
    notes: z.string().optional(),
    color: z.string().default("#8B1D3B"),
  }),
})

// List functions
router.get("/:weddingId", requireAuth, requireWeddingOwner, async (req: AuthRequest, res, next) => {
  try {
    const functions = await prisma.weddingFunction.findMany({
      where: { weddingId: req.weddingId },
      orderBy: { createdAt: "asc" },
    })

    res.json({ success: true, data: { functions } })
  } catch (error) {
    next(error)
  }
})

// Create function
router.post("/:weddingId", requireAuth, requireWeddingOwner, validate(functionSchema), async (req: AuthRequest, res, next) => {
  try {
    const data = req.body
    const fn = await prisma.weddingFunction.create({
      data: {
        weddingId: req.weddingId!,
        name: data.name,
        hindiName: data.hindiName || "",
        date: data.date || "",
        time: data.time || "",
        venue: data.venue || "",
        dresscode: data.dresscode || "",
        notes: data.notes || "",
        color: data.color || "#8B1D3B",
      },
    })

    res.status(201).json({ success: true, data: { function: fn } })
  } catch (error) {
    next(error)
  }
})

// Update function
router.put("/:weddingId/:id", requireAuth, requireWeddingOwner, async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params
    const data = req.body

    const updated = await prisma.weddingFunction.update({
      where: { id },
      data: {
        name: data.name,
        hindiName: data.hindiName,
        date: data.date,
        time: data.time,
        venue: data.venue,
        dresscode: data.dresscode,
        notes: data.notes,
        color: data.color,
      },
    })

    res.json({ success: true, data: { function: updated } })
  } catch (error) {
    next(error)
  }
})

// Delete function
router.delete("/:weddingId/:id", requireAuth, requireWeddingOwner, async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params
    await prisma.weddingFunction.delete({ where: { id } })
    res.json({ success: true, message: "Function deleted successfully." })
  } catch (error) {
    next(error)
  }
})

export default router
