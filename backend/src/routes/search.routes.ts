import { Router } from "express"
import { prisma } from "../db/prisma"
import { requireAuth, requireWeddingOwner, AuthRequest } from "../middleware/auth"

const router = Router()

router.get("/:weddingId", requireAuth, requireWeddingOwner, async (req: AuthRequest, res, next) => {
  try {
    const { weddingId } = req
    const query = (req.query.q as string || "").trim()

    if (!query || query.length < 2) {
      res.json({ success: true, data: { results: [] } })
      return
    }

    const [guests, vendors, tasks, functions, notes] = await Promise.all([
      prisma.guest.findMany({
        where: {
          weddingId,
          OR: [
            { name: { contains: query } },
            { phone: { contains: query } },
          ],
        },
        take: 5,
      }),
      prisma.vendor.findMany({
        where: {
          weddingId,
          OR: [
            { name: { contains: query } },
            { category: { contains: query } },
          ],
        },
        take: 5,
      }),
      prisma.checklistItem.findMany({
        where: {
          weddingId,
          task: { contains: query },
        },
        take: 5,
      }),
      prisma.weddingFunction.findMany({
        where: {
          weddingId,
          OR: [
            { name: { contains: query } },
            { venue: { contains: query } },
          ],
        },
        take: 5,
      }),
      prisma.note.findMany({
        where: {
          weddingId,
          OR: [
            { title: { contains: query } },
            { content: { contains: query } },
          ],
        },
        take: 5,
      }),
    ])

    const results = [
      ...guests.map((g) => ({ type: "guest", id: g.id, title: g.name, subtitle: `RSVP: ${g.rsvp} | Side: ${g.side}`, page: "guests" })),
      ...vendors.map((v) => ({ type: "vendor", id: v.id, title: v.name, subtitle: `Category: ${v.category} | Status: ${v.status}`, page: "vendors" })),
      ...tasks.map((t) => ({ type: "task", id: t.id, title: t.task, subtitle: `Priority: ${t.priority} | ${t.done ? "Done" : "Pending"}`, page: "checklist" })),
      ...functions.map((f) => ({ type: "function", id: f.id, title: f.name, subtitle: `Time: ${f.time} | Venue: ${f.venue || "TBD"}`, page: "functions" })),
      ...notes.map((n) => ({ type: "note", id: n.id, title: n.title, subtitle: n.content.substring(0, 40), page: "notes" })),
    ]

    res.json({ success: true, data: { results } })
  } catch (error) {
    next(error)
  }
})

export default router
