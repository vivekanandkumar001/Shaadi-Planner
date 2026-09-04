import { Router } from "express"
import { z } from "zod"
import { prisma } from "../db/prisma"
import { requireAuth, AuthRequest } from "../middleware/auth"
import { validate } from "../middleware/validate"

const router = Router()

const createWeddingSchema = z.object({
  body: z.object({
    title: z.string().min(2, "Title must be at least 2 characters"),
    brideName: z.string().min(1, "Bride name is required"),
    groomName: z.string().min(1, "Groom name is required"),
    weddingDate: z.string().min(1, "Wedding date is required"),
    location: z.string().optional(),
    city: z.string().optional(),
    cityTier: z.enum(["metro", "tier2", "tier3"]).default("metro"),
    venue: z.string().optional(),
    estimatedGuests: z.number().default(300),
    estimatedBudget: z.number().default(2500000),
    eventDays: z.number().default(3),
    currency: z.string().default("INR"),
    theme: z.string().optional(),
    notes: z.string().optional(),
  }),
})

const DEFAULT_FUNCTIONS = [
  { name: "Haldi", hindiName: "हल्दी", time: "10:00", dresscode: "Yellow / Ethnic", notes: "Turmeric ceremony", color: "#CA8A04" },
  { name: "Mehendi", hindiName: "मेहंदी", time: "15:00", dresscode: "Green / Ethnic", notes: "Bride's mehendi ceremony", color: "#16A34A" },
  { name: "Sangeet", hindiName: "संगीत", time: "19:00", dresscode: "Festive / Party", notes: "Music & dance celebration", color: "#7C3AED" },
  { name: "Baraat", hindiName: "बारात", time: "18:00", dresscode: "Sherwani / Formal", notes: "Groom's procession", color: "#D4900A" },
  { name: "Vivah", hindiName: "विवाह", time: "21:00", dresscode: "Bridal / Formal", notes: "The main wedding ceremony", color: "#8B1D3B" },
  { name: "Reception", hindiName: "रिसेप्शन", time: "19:00", dresscode: "Indo-Western / Formal", notes: "Reception dinner", color: "#0891B2" },
]

const DEFAULT_CHECKLIST = [
  { task: "Book wedding venue", category: "venue", priority: "high" },
  { task: "Finalise guest list", category: "other", priority: "high" },
  { task: "Book pandit / priest", category: "other", priority: "high" },
  { task: "Book caterer", category: "catering", priority: "high" },
  { task: "Book photographer & videographer", category: "other", priority: "high" },
  { task: "Book decorator / florist", category: "decor", priority: "high" },
  { task: "Order bridal lehenga / saree", category: "outfits", priority: "high" },
  { task: "Order groom's sherwani / suit", category: "outfits", priority: "medium" },
  { task: "Design & print invitation cards", category: "invites", priority: "medium" },
  { task: "Send invitations to all guests", category: "invites", priority: "medium" },
  { task: "Book bridal makeup artist", category: "beauty", priority: "medium" },
  { task: "Book mehendi artist", category: "beauty", priority: "medium" },
]

const DEFAULT_MENU = [
  { name: "Welcome Drinks", hindiName: "स्वागत पेय", mealType: "veg", items: ["Fresh Lime Soda", "Aam Panna", "Rose Sharbat"] },
  { name: "Starters — Veg", hindiName: "स्टार्टर (शाकाहारी)", mealType: "veg", items: ["Paneer Tikka", "Hara Bhara Kabab", "Dahi Ke Sholey"] },
  { name: "Main Course — Veg", hindiName: "मुख्य व्यंजन", mealType: "veg", items: ["Dal Makhani", "Paneer Butter Masala", "Jeera Rice", "Naan"] },
  { name: "Desserts", hindiName: "मिठाई", mealType: "veg", items: ["Gulab Jamun", "Gajar Halwa", "Ice Cream"] },
]

// Get all user weddings
router.get("/", requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const weddings = await prisma.wedding.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: {
            guests: true,
            vendors: true,
            checklistItems: true,
            functions: true,
          },
        },
      },
    })

    res.json({ success: true, data: { weddings } })
  } catch (error) {
    next(error)
  }
})

// Create wedding
router.post("/", requireAuth, validate(createWeddingSchema), async (req: AuthRequest, res, next) => {
  try {
    const data = req.body

    const wedding = await prisma.wedding.create({
      data: {
        userId: req.userId!,
        title: data.title,
        brideName: data.brideName,
        groomName: data.groomName,
        weddingDate: data.weddingDate,
        location: data.location || "",
        city: data.city || "",
        cityTier: data.cityTier,
        venue: data.venue || "",
        estimatedGuests: data.estimatedGuests,
        estimatedBudget: data.estimatedBudget,
        eventDays: data.eventDays,
        currency: data.currency,
        theme: data.theme || "",
        notes: data.notes || "",
        functions: {
          create: DEFAULT_FUNCTIONS.map((f) => ({
            name: f.name,
            hindiName: f.hindiName,
            time: f.time,
            dresscode: f.dresscode,
            notes: f.notes,
            color: f.color,
          })),
        },
        checklistItems: {
          create: DEFAULT_CHECKLIST.map((c) => ({
            task: c.task,
            category: c.category,
            priority: c.priority,
          })),
        },
        menuCourses: {
          create: DEFAULT_MENU.map((m) => ({
            name: m.name,
            hindiName: m.hindiName,
            mealType: m.mealType,
            items: {
              create: m.items.map((i) => ({ name: i })),
            },
          })),
        },
      },
      include: {
        functions: true,
        checklistItems: true,
        menuCourses: { include: { items: true } },
      },
    })

    res.status(201).json({ success: true, data: { wedding } })
  } catch (error) {
    next(error)
  }
})

// Get wedding details + dashboard metrics
router.get("/:id", requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params
    const wedding = await prisma.wedding.findFirst({
      where: { id, userId: req.userId },
      include: {
        guests: { include: { table: true } },
        tables: { include: { guests: true } },
        vendors: true,
        functions: true,
        checklistItems: true,
        shagunEntries: true,
        menuCourses: { include: { items: true } },
        notesItems: true,
      },
    })

    if (!wedding) {
      res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Wedding not found" } })
      return
    }

    // Server-side dashboard calculations
    const totalGuests = wedding.guests.length
    const confirmedGuests = wedding.guests.filter((g) => g.rsvp === "confirmed").length
    const pendingGuests = wedding.guests.filter((g) => g.rsvp === "pending").length
    const declinedGuests = wedding.guests.filter((g) => g.rsvp === "declined").length

    const totalVendors = wedding.vendors.length
    const bookedVendors = wedding.vendors.filter((v) => v.status === "booked" || v.status === "paid" || v.status === "completed").length
    const totalVendorQuoted = wedding.vendors.reduce((acc, v) => acc + Number(v.quotedAmount), 0)
    const totalVendorPaid = wedding.vendors.reduce((acc, v) => acc + Number(v.paidAmount), 0)

    const totalTasks = wedding.checklistItems.length
    const completedTasks = wedding.checklistItems.filter((t) => t.done).length

    const totalShagunAmount = wedding.shagunEntries.reduce((acc, s) => acc + Number(s.amount), 0)

    const metrics = {
      totalGuests,
      confirmedGuests,
      pendingGuests,
      declinedGuests,
      totalVendors,
      bookedVendors,
      totalVendorQuoted,
      totalVendorPaid,
      totalTasks,
      completedTasks,
      totalShagunAmount,
      guestRSVPPercentage: totalGuests > 0 ? Math.round((confirmedGuests / totalGuests) * 100) : 0,
      checklistPercentage: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
    }

    res.json({
      success: true,
      data: {
        wedding,
        metrics,
      },
    })
  } catch (error) {
    next(error)
  }
})

// Update wedding
router.put("/:id", requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params
    const data = req.body

    const existing = await prisma.wedding.findFirst({ where: { id, userId: req.userId } })
    if (!existing) {
      res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Wedding not found" } })
      return
    }

    const updated = await prisma.wedding.update({
      where: { id },
      data: {
        title: data.title ?? existing.title,
        brideName: data.brideName ?? existing.brideName,
        groomName: data.groomName ?? existing.groomName,
        weddingDate: data.weddingDate ?? existing.weddingDate,
        location: data.location ?? existing.location,
        city: data.city ?? existing.city,
        cityTier: data.cityTier ?? existing.cityTier,
        venue: data.venue ?? existing.venue,
        estimatedGuests: data.estimatedGuests ?? existing.estimatedGuests,
        estimatedBudget: data.estimatedBudget ?? existing.estimatedBudget,
        eventDays: data.eventDays ?? existing.eventDays,
        currency: data.currency ?? existing.currency,
        theme: data.theme ?? existing.theme,
        notes: data.notes ?? existing.notes,
      },
    })

    res.json({ success: true, data: { wedding: updated } })
  } catch (error) {
    next(error)
  }
})

// Delete wedding
router.delete("/:id", requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params
    const existing = await prisma.wedding.findFirst({ where: { id, userId: req.userId } })
    if (!existing) {
      res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Wedding not found" } })
      return
    }

    await prisma.wedding.delete({ where: { id } })
    res.json({ success: true, message: "Wedding deleted successfully." })
  } catch (error) {
    next(error)
  }
})

export default router
