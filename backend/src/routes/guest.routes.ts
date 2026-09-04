import { Router } from "express"
import { z } from "zod"
import { prisma } from "../db/prisma"
import { requireAuth, requireWeddingOwner, AuthRequest } from "../middleware/auth"
import { validate } from "../middleware/validate"

const router = Router()

const guestSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    side: z.enum(["bride", "groom", "common"]).default("common"),
    rsvp: z.enum(["confirmed", "pending", "declined"]).default("pending"),
    meal: z.enum(["veg", "nonveg", "jain"]).default("veg"),
    plusOnes: z.number().min(0).default(0),
    phone: z.string().optional(),
    email: z.string().optional(),
    notes: z.string().optional(),
    tableId: z.string().nullable().optional(),
  }),
})

// List guests
router.get("/:weddingId", requireAuth, requireWeddingOwner, async (req: AuthRequest, res, next) => {
  try {
    const { weddingId } = req
    const { side, rsvp, search } = req.query

    const where: any = { weddingId }
    if (side) where.side = side as string
    if (rsvp) where.rsvp = rsvp as string
    if (search) {
      where.OR = [
        { name: { contains: search as string } },
        { phone: { contains: search as string } },
      ]
    }

    const guests = await prisma.guest.findMany({
      where,
      include: { table: true },
      orderBy: { createdAt: "desc" },
    })

    res.json({ success: true, data: { guests } })
  } catch (error) {
    next(error)
  }
})

// Add guest
router.post("/:weddingId", requireAuth, requireWeddingOwner, validate(guestSchema), async (req: AuthRequest, res, next) => {
  try {
    const { weddingId } = req
    const data = req.body

    const guest = await prisma.guest.create({
      data: {
        weddingId: weddingId!,
        name: data.name,
        side: data.side,
        rsvp: data.rsvp,
        meal: data.meal,
        plusOnes: data.plusOnes,
        phone: data.phone || "",
        email: data.email || "",
        notes: data.notes || "",
        tableId: data.tableId || null,
      },
      include: { table: true },
    })

    res.status(201).json({ success: true, data: { guest } })
  } catch (error) {
    next(error)
  }
})

// Update guest
router.put("/:weddingId/:id", requireAuth, requireWeddingOwner, async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params
    const data = req.body

    const updated = await prisma.guest.update({
      where: { id },
      data: {
        name: data.name,
        side: data.side,
        rsvp: data.rsvp,
        meal: data.meal,
        plusOnes: data.plusOnes,
        phone: data.phone,
        email: data.email,
        notes: data.notes,
        tableId: data.tableId === undefined ? undefined : data.tableId,
      },
      include: { table: true },
    })

    res.json({ success: true, data: { guest: updated } })
  } catch (error) {
    next(error)
  }
})

// Delete guest
router.delete("/:weddingId/:id", requireAuth, requireWeddingOwner, async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params
    await prisma.guest.delete({ where: { id } })
    res.json({ success: true, message: "Guest deleted successfully." })
  } catch (error) {
    next(error)
  }
})

export default router
