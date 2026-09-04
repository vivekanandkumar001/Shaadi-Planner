import { Router } from "express"
import { z } from "zod"
import { prisma } from "../db/prisma"
import { requireAuth, requireWeddingOwner, AuthRequest } from "../middleware/auth"
import { validate } from "../middleware/validate"

const router = Router()

const createTableSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Table name is required"),
    capacity: z.number().min(1, "Capacity must be at least 1").default(8),
  }),
})

const assignGuestSchema = z.object({
  body: z.object({
    guestId: z.string().min(1, "Guest ID is required"),
    tableId: z.string().min(1, "Table ID is required"),
  }),
})

// List tables and guest counts
router.get("/:weddingId", requireAuth, requireWeddingOwner, async (req: AuthRequest, res, next) => {
  try {
    const tables = await prisma.tableData.findMany({
      where: { weddingId: req.weddingId },
      include: { guests: true },
      orderBy: { createdAt: "asc" },
    })

    const unassignedGuests = await prisma.guest.findMany({
      where: {
        weddingId: req.weddingId,
        tableId: null,
      },
    })

    res.json({ success: true, data: { tables, unassignedGuests } })
  } catch (error) {
    next(error)
  }
})

// Add table
router.post("/:weddingId", requireAuth, requireWeddingOwner, validate(createTableSchema), async (req: AuthRequest, res, next) => {
  try {
    const data = req.body
    const table = await prisma.tableData.create({
      data: {
        weddingId: req.weddingId!,
        name: data.name,
        capacity: data.capacity,
      },
      include: { guests: true },
    })

    res.status(201).json({ success: true, data: { table } })
  } catch (error) {
    next(error)
  }
})

// Assign guest to table (with backend capacity check)
router.post("/:weddingId/assign", requireAuth, requireWeddingOwner, validate(assignGuestSchema), async (req: AuthRequest, res, next) => {
  try {
    const { guestId, tableId } = req.body

    const table = await prisma.tableData.findUnique({
      where: { id: tableId },
      include: { guests: true },
    })

    if (!table || table.weddingId !== req.weddingId) {
      res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Table not found." } })
      return
    }

    if (table.guests.length >= table.capacity) {
      res.status(400).json({
        success: false,
        error: {
          code: "TABLE_FULL",
          message: `Table "${table.name}" has reached its maximum capacity of ${table.capacity} guests.`,
        },
      })
      return
    }

    const guest = await prisma.guest.findUnique({ where: { id: guestId } })
    if (!guest || guest.weddingId !== req.weddingId) {
      res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Guest not found." } })
      return
    }

    const updatedGuest = await prisma.guest.update({
      where: { id: guestId },
      data: { tableId },
      include: { table: true },
    })

    res.json({ success: true, data: { guest: updatedGuest } })
  } catch (error) {
    next(error)
  }
})

// Unassign guest from table
router.post("/:weddingId/unassign", requireAuth, requireWeddingOwner, async (req: AuthRequest, res, next) => {
  try {
    const { guestId } = req.body
    if (!guestId) {
      res.status(400).json({ success: false, error: { code: "BAD_REQUEST", message: "Guest ID is required." } })
      return
    }

    const updatedGuest = await prisma.guest.update({
      where: { id: guestId },
      data: { tableId: null },
    })

    res.json({ success: true, data: { guest: updatedGuest } })
  } catch (error) {
    next(error)
  }
})

// Delete table
router.delete("/:weddingId/:id", requireAuth, requireWeddingOwner, async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params
    await prisma.tableData.delete({ where: { id } })
    res.json({ success: true, message: "Table deleted successfully." })
  } catch (error) {
    next(error)
  }
})

export default router
