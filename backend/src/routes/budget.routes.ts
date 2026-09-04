import { Router } from "express"
import { z } from "zod"
import { prisma } from "../db/prisma"
import { requireAuth, requireWeddingOwner, AuthRequest } from "../middleware/auth"
import { validate } from "../middleware/validate"

const router = Router()

const updateBudgetSchema = z.object({
  body: z.object({
    totalBudget: z.number().min(0, "Total budget must be non-negative"),
    cityTier: z.enum(["metro", "tier2", "tier3"]).default("metro"),
    guestCount: z.number().min(1).default(300),
    eventDays: z.number().min(1).default(3),
  }),
})

// Get budget overview and server-recalculated stats
router.get("/:weddingId", requireAuth, requireWeddingOwner, async (req: AuthRequest, res, next) => {
  try {
    const wedding = await prisma.wedding.findUnique({
      where: { id: req.weddingId },
      include: {
        vendors: true,
      },
    })

    if (!wedding) {
      res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Wedding not found" } })
      return
    }

    const totalBudget = Number(wedding.estimatedBudget)
    const totalVendorQuoted = wedding.vendors.reduce((acc, v) => acc + Number(v.quotedAmount), 0)
    const totalVendorPaid = wedding.vendors.reduce((acc, v) => acc + Number(v.paidAmount), 0)
    const remainingBudget = Math.max(0, totalBudget - totalVendorQuoted)

    // Category breakdown
    const categoryTotals: Record<string, { quoted: number; paid: number; count: number }> = {}
    wedding.vendors.forEach((v) => {
      const cat = v.category || "other"
      if (!categoryTotals[cat]) {
        categoryTotals[cat] = { quoted: 0, paid: 0, count: 0 }
      }
      categoryTotals[cat].quoted += Number(v.quotedAmount)
      categoryTotals[cat].paid += Number(v.paidAmount)
      categoryTotals[cat].count += 1
    })

    res.json({
      success: true,
      data: {
        budgetSummary: {
          totalBudget,
          totalVendorQuoted,
          totalVendorPaid,
          remainingBudget,
          cityTier: wedding.cityTier,
          guestCount: wedding.estimatedGuests,
          eventDays: wedding.eventDays,
          categoryTotals,
        },
      },
    })
  } catch (error) {
    next(error)
  }
})

// Update budget configuration
router.put("/:weddingId", requireAuth, requireWeddingOwner, validate(updateBudgetSchema), async (req: AuthRequest, res, next) => {
  try {
    const { totalBudget, cityTier, guestCount, eventDays } = req.body

    const updated = await prisma.wedding.update({
      where: { id: req.weddingId },
      data: {
        estimatedBudget: totalBudget,
        cityTier,
        estimatedGuests: guestCount,
        eventDays,
      },
    })

    res.json({
      success: true,
      data: {
        totalBudget: Number(updated.estimatedBudget),
        cityTier: updated.cityTier,
        guestCount: updated.estimatedGuests,
        eventDays: updated.eventDays,
      },
    })
  } catch (error) {
    next(error)
  }
})

export default router
