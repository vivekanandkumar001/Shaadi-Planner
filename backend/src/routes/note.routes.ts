import { Router } from "express"
import { z } from "zod"
import { prisma } from "../db/prisma"
import { requireAuth, requireWeddingOwner, AuthRequest } from "../middleware/auth"
import { validate } from "../middleware/validate"

const router = Router()

const noteSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required"),
    content: z.string().default(""),
    color: z.string().default("#8B1D3B"),
    pinned: z.boolean().default(false),
  }),
})

// List notes
router.get("/:weddingId", requireAuth, requireWeddingOwner, async (req: AuthRequest, res, next) => {
  try {
    const notes = await prisma.note.findMany({
      where: { weddingId: req.weddingId },
      orderBy: [{ pinned: "desc" }, { createdAt: "desc" }],
    })

    res.json({ success: true, data: { notes } })
  } catch (error) {
    next(error)
  }
})

// Add note
router.post("/:weddingId", requireAuth, requireWeddingOwner, validate(noteSchema), async (req: AuthRequest, res, next) => {
  try {
    const data = req.body
    const note = await prisma.note.create({
      data: {
        weddingId: req.weddingId!,
        title: data.title,
        content: data.content || "",
        color: data.color || "#8B1D3B",
        pinned: data.pinned || false,
      },
    })

    res.status(201).json({ success: true, data: { note } })
  } catch (error) {
    next(error)
  }
})

// Update note
router.put("/:weddingId/:id", requireAuth, requireWeddingOwner, async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params
    const data = req.body

    const updated = await prisma.note.update({
      where: { id },
      data: {
        title: data.title,
        content: data.content,
        color: data.color,
        pinned: data.pinned,
      },
    })

    res.json({ success: true, data: { note: updated } })
  } catch (error) {
    next(error)
  }
})

// Toggle pin
router.patch("/:weddingId/:id/pin", requireAuth, requireWeddingOwner, async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params
    const note = await prisma.note.findUnique({ where: { id } })
    if (!note) {
      res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Note not found" } })
      return
    }

    const updated = await prisma.note.update({
      where: { id },
      data: { pinned: !note.pinned },
    })

    res.json({ success: true, data: { note: updated } })
  } catch (error) {
    next(error)
  }
})

// Delete note
router.delete("/:weddingId/:id", requireAuth, requireWeddingOwner, async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params
    await prisma.note.delete({ where: { id } })
    res.json({ success: true, message: "Note deleted." })
  } catch (error) {
    next(error)
  }
})

export default router
