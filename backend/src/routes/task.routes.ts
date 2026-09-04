import { Router } from "express"
import { z } from "zod"
import { prisma } from "../db/prisma"
import { requireAuth, requireWeddingOwner, AuthRequest } from "../middleware/auth"
import { validate } from "../middleware/validate"

const router = Router()

const taskSchema = z.object({
  body: z.object({
    task: z.string().min(1, "Task description is required"),
    category: z.string().default("other"),
    priority: z.enum(["high", "medium", "low"]).default("medium"),
    dueDate: z.string().optional(),
    done: z.boolean().default(false),
  }),
})

// List tasks
router.get("/:weddingId", requireAuth, requireWeddingOwner, async (req: AuthRequest, res, next) => {
  try {
    const tasks = await prisma.checklistItem.findMany({
      where: { weddingId: req.weddingId },
      orderBy: { createdAt: "desc" },
    })

    res.json({ success: true, data: { tasks } })
  } catch (error) {
    next(error)
  }
})

// Create task
router.post("/:weddingId", requireAuth, requireWeddingOwner, validate(taskSchema), async (req: AuthRequest, res, next) => {
  try {
    const data = req.body
    const item = await prisma.checklistItem.create({
      data: {
        weddingId: req.weddingId!,
        task: data.task,
        category: data.category,
        priority: data.priority,
        dueDate: data.dueDate || "",
        done: data.done || false,
      },
    })

    res.status(201).json({ success: true, data: { task: item } })
  } catch (error) {
    next(error)
  }
})

// Toggle task status
router.patch("/:weddingId/:id/toggle", requireAuth, requireWeddingOwner, async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params
    const existing = await prisma.checklistItem.findUnique({ where: { id } })
    if (!existing) {
      res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Task not found" } })
      return
    }

    const updated = await prisma.checklistItem.update({
      where: { id },
      data: { done: !existing.done },
    })

    res.json({ success: true, data: { task: updated } })
  } catch (error) {
    next(error)
  }
})

// Update task
router.put("/:weddingId/:id", requireAuth, requireWeddingOwner, async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params
    const data = req.body

    const updated = await prisma.checklistItem.update({
      where: { id },
      data: {
        task: data.task,
        category: data.category,
        priority: data.priority,
        dueDate: data.dueDate,
        done: data.done,
      },
    })

    res.json({ success: true, data: { task: updated } })
  } catch (error) {
    next(error)
  }
})

// Delete task
router.delete("/:weddingId/:id", requireAuth, requireWeddingOwner, async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params
    await prisma.checklistItem.delete({ where: { id } })
    res.json({ success: true, message: "Task deleted successfully." })
  } catch (error) {
    next(error)
  }
})

export default router
