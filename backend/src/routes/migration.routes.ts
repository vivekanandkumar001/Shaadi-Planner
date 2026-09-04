import { Router } from "express"
import { prisma } from "../db/prisma"
import { requireAuth, AuthRequest } from "../middleware/auth"

const router = Router()

router.post("/import", requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const userId = req.userId!
    const { coupleName, weddingDate, budget, guests, tables, vendors, functions, checklist, shagun, menuCourses, notes } = req.body

    const title = coupleName ? `${coupleName}'s Shaadi` : "My Shaadi Plan"
    const brideName = coupleName ? coupleName.split("&")[0]?.trim() || coupleName : "Bride"
    const groomName = coupleName ? coupleName.split("&")[1]?.trim() || "Groom" : "Groom"

    // Create wedding and import all nested records
    const wedding = await prisma.wedding.create({
      data: {
        userId,
        title,
        brideName,
        groomName,
        weddingDate: weddingDate || new Date().toISOString().split("T")[0],
        estimatedBudget: budget?.totalBudget ? Number(budget.totalBudget) : 2500000,
        estimatedGuests: budget?.guestCount ? Number(budget.guestCount) : 300,
        cityTier: budget?.cityTier || "metro",
        eventDays: budget?.eventDays ? Number(budget.eventDays) : 3,
        functions: {
          create: (functions || []).map((f: any) => ({
            name: f.name,
            hindiName: f.hindiName || "",
            date: f.date || "",
            time: f.time || "",
            venue: f.venue || "",
            dresscode: f.dresscode || "",
            notes: f.notes || "",
            color: f.color || "#8B1D3B",
          })),
        },
        checklistItems: {
          create: (checklist || []).map((c: any) => ({
            task: c.task,
            category: c.category || "other",
            priority: c.priority || "medium",
            dueDate: c.dueDate || "",
            done: c.done || false,
          })),
        },
        tables: {
          create: (tables || []).map((t: any) => ({
            name: t.name,
            capacity: t.capacity || 8,
          })),
        },
        vendors: {
          create: (vendors || []).map((v: any) => ({
            name: v.name,
            category: v.category || "other",
            contact: v.contact || "",
            quotedAmount: Number(v.quotedAmount || 0),
            paidAmount: Number(v.paidAmount || 0),
            status: v.status || "enquired",
            notes: v.notes || "",
          })),
        },
        shagunEntries: {
          create: (shagun || []).map((s: any) => ({
            guestName: s.guestName,
            amount: Number(s.amount || 0),
            type: s.type || "cash",
            description: s.description || "",
            date: s.date || "",
          })),
        },
        notesItems: {
          create: (notes || []).map((n: any) => ({
            title: n.title,
            content: n.content || "",
            color: n.color || "#8B1D3B",
          })),
        },
      },
      include: {
        tables: true,
      },
    })

    // Import guests with table mapping if tables existed
    if (guests && Array.isArray(guests)) {
      const tableMap = new Map<string, string>()
      wedding.tables.forEach((t) => {
        tableMap.set(t.name, t.id)
      })

      for (const g of guests) {
        await prisma.guest.create({
          data: {
            weddingId: wedding.id,
            name: g.name,
            side: g.side || "common",
            rsvp: g.rsvp || "pending",
            meal: g.meal || "veg",
            plusOnes: Number(g.plusOnes || 0),
            phone: g.phone || "",
            tableId: g.tableId ? tableMap.get(g.tableId) || null : null,
          },
        })
      }
    }

    // Import menu courses
    if (menuCourses && Array.isArray(menuCourses)) {
      for (const mc of menuCourses) {
        await prisma.menuCourse.create({
          data: {
            weddingId: wedding.id,
            name: mc.name,
            hindiName: mc.hindiName || "",
            mealType: mc.mealType || "veg",
            items: {
              create: (mc.items || []).map((item: string) => ({ name: item })),
            },
          },
        })
      }
    }

    res.json({
      success: true,
      message: "Legacy localStorage wedding data migrated successfully to PostgreSQL.",
      data: { weddingId: wedding.id },
    })
  } catch (error) {
    next(error)
  }
})

export default router
