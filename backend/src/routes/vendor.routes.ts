import { Router } from "express"
import { z } from "zod"
import { prisma } from "../db/prisma"
import { requireAuth, requireWeddingOwner, AuthRequest } from "../middleware/auth"
import { validate } from "../middleware/validate"

const router = Router()

const vendorSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Vendor name is required"),
    category: z.string().default("other"),
    contact: z.string().optional(),
    email: z.string().optional(),
    quotedAmount: z.number().min(0, "Quoted amount must be 0 or positive").default(0),
    paidAmount: z.number().min(0, "Paid amount must be 0 or positive").default(0),
    status: z.enum(["enquired", "booked", "paid", "completed", "cancelled"]).default("enquired"),
    notes: z.string().optional(),
    relatedEvent: z.string().optional(),
  }),
})

// List vendors
router.get("/:weddingId", requireAuth, requireWeddingOwner, async (req: AuthRequest, res, next) => {
  try {
    const vendors = await prisma.vendor.findMany({
      where: { weddingId: req.weddingId },
      orderBy: { createdAt: "desc" },
    })

    const formattedVendors = vendors.map((v) => ({
      ...v,
      quotedAmount: Number(v.quotedAmount),
      paidAmount: Number(v.paidAmount),
      dueAmount: Math.max(0, Number(v.quotedAmount) - Number(v.paidAmount)),
    }))

    res.json({ success: true, data: { vendors: formattedVendors } })
  } catch (error) {
    next(error)
  }
})

// Add vendor
router.post("/:weddingId", requireAuth, requireWeddingOwner, validate(vendorSchema), async (req: AuthRequest, res, next) => {
  try {
    const data = req.body
    const vendor = await prisma.vendor.create({
      data: {
        weddingId: req.weddingId!,
        name: data.name,
        category: data.category,
        contact: data.contact || "",
        email: data.email || "",
        quotedAmount: data.quotedAmount,
        paidAmount: data.paidAmount,
        status: data.status,
        notes: data.notes || "",
        relatedEvent: data.relatedEvent || "",
      },
    })

    res.status(201).json({
      success: true,
      data: {
        vendor: {
          ...vendor,
          quotedAmount: Number(vendor.quotedAmount),
          paidAmount: Number(vendor.paidAmount),
          dueAmount: Math.max(0, Number(vendor.quotedAmount) - Number(vendor.paidAmount)),
        },
      },
    })
  } catch (error) {
    next(error)
  }
})

// Update vendor
router.put("/:weddingId/:id", requireAuth, requireWeddingOwner, async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params
    const data = req.body

    const updated = await prisma.vendor.update({
      where: { id },
      data: {
        name: data.name,
        category: data.category,
        contact: data.contact,
        email: data.email,
        quotedAmount: data.quotedAmount,
        paidAmount: data.paidAmount,
        status: data.status,
        notes: data.notes,
        relatedEvent: data.relatedEvent,
      },
    })

    res.json({
      success: true,
      data: {
        vendor: {
          ...updated,
          quotedAmount: Number(updated.quotedAmount),
          paidAmount: Number(updated.paidAmount),
          dueAmount: Math.max(0, Number(updated.quotedAmount) - Number(updated.paidAmount)),
        },
      },
    })
  } catch (error) {
    next(error)
  }
})

// Delete vendor
router.delete("/:weddingId/:id", requireAuth, requireWeddingOwner, async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params
    await prisma.vendor.delete({ where: { id } })
    res.json({ success: true, message: "Vendor deleted successfully." })
  } catch (error) {
    next(error)
  }
})

export default router
