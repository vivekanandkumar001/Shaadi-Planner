import { Router } from "express"
import { prisma } from "../db/prisma"
import { requireAuth, requireWeddingOwner, AuthRequest } from "../middleware/auth"

const router = Router()

// Get menu courses
router.get("/:weddingId", requireAuth, requireWeddingOwner, async (req: AuthRequest, res, next) => {
  try {
    const courses = await prisma.menuCourse.findMany({
      where: { weddingId: req.weddingId },
      include: { items: true },
      orderBy: { createdAt: "asc" },
    })

    const formatted = courses.map((c) => ({
      id: c.id,
      name: c.name,
      hindiName: c.hindiName || "",
      mealType: c.mealType,
      items: c.items.map((i) => i.name),
    }))

    res.json({ success: true, data: { courses: formatted } })
  } catch (error) {
    next(error)
  }
})

// Create course
router.post("/:weddingId", requireAuth, requireWeddingOwner, async (req: AuthRequest, res, next) => {
  try {
    const { name, hindiName, mealType, items } = req.body

    const course = await prisma.menuCourse.create({
      data: {
        weddingId: req.weddingId!,
        name,
        hindiName: hindiName || "",
        mealType: mealType || "veg",
        items: {
          create: (items || []).map((item: string) => ({ name: item })),
        },
      },
      include: { items: true },
    })

    res.status(201).json({
      success: true,
      data: {
        course: {
          id: course.id,
          name: course.name,
          hindiName: course.hindiName,
          mealType: course.mealType,
          items: course.items.map((i) => i.name),
        },
      },
    })
  } catch (error) {
    next(error)
  }
})

// Update course
router.put("/:weddingId/:id", requireAuth, requireWeddingOwner, async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params
    const { name, hindiName, mealType, items } = req.body

    // Delete existing items and replace
    await prisma.menuItem.deleteMany({ where: { courseId: id } })

    const updated = await prisma.menuCourse.update({
      where: { id },
      data: {
        name,
        hindiName,
        mealType,
        items: {
          create: (items || []).map((item: string) => ({ name: item })),
        },
      },
      include: { items: true },
    })

    res.json({
      success: true,
      data: {
        course: {
          id: updated.id,
          name: updated.name,
          hindiName: updated.hindiName,
          mealType: updated.mealType,
          items: updated.items.map((i) => i.name),
        },
      },
    })
  } catch (error) {
    next(error)
  }
})

// Delete course
router.delete("/:weddingId/:id", requireAuth, requireWeddingOwner, async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params
    await prisma.menuCourse.delete({ where: { id } })
    res.json({ success: true, message: "Menu course deleted." })
  } catch (error) {
    next(error)
  }
})

export default router
