import { Router } from "express"
import crypto from "crypto"
import { prisma } from "../db/prisma"
import { requireAuth, requireWeddingOwner, AuthRequest } from "../middleware/auth"

const router = Router()

// Create a safe, unpredictable random share link token
router.post("/:weddingId", requireAuth, requireWeddingOwner, async (req: AuthRequest, res, next) => {
  try {
    const { weddingId } = req
    const token = crypto.randomBytes(16).toString("hex")
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days valid

    const shareLink = await prisma.shareLink.create({
      data: {
        weddingId: weddingId!,
        token,
        expiresAt,
      },
    })

    res.json({
      success: true,
      data: {
        token: shareLink.token,
        expiresAt: shareLink.expiresAt,
        shareUrl: `${process.env.FRONTEND_URL || "http://localhost:5173"}/share/${shareLink.token}`,
      },
    })
  } catch (error) {
    next(error)
  }
})

// Publicly view shared wedding overview (no auth required, but strict token validation)
router.get("/public/:token", async (req, res, next) => {
  try {
    const { token } = req.params

    const shareLink = await prisma.shareLink.findUnique({
      where: { token },
      include: {
        wedding: {
          select: {
            title: true,
            brideName: true,
            groomName: true,
            weddingDate: true,
            location: true,
            city: true,
            venue: true,
            functions: {
              select: { name: true, hindiName: true, date: true, time: true, venue: true, dresscode: true, color: true },
            },
            menuCourses: {
              select: { name: true, hindiName: true, mealType: true, items: { select: { name: true } } },
            },
          },
        },
      },
    })

    if (!shareLink || (shareLink.expiresAt && shareLink.expiresAt < new Date())) {
      res.status(404).json({
        success: false,
        error: { code: "LINK_EXPIRED_OR_INVALID", message: "This share link is invalid or has expired." },
      })
      return
    }

    res.json({
      success: true,
      data: {
        wedding: shareLink.wedding,
      },
    })
  } catch (error) {
    next(error)
  }
})

// Revoke share link
router.delete("/:weddingId/:token", requireAuth, requireWeddingOwner, async (req: AuthRequest, res, next) => {
  try {
    const { token } = req.params
    await prisma.shareLink.deleteMany({
      where: { token, weddingId: req.weddingId },
    })

    res.json({ success: true, message: "Share link revoked successfully." })
  } catch (error) {
    next(error)
  }
})

export default router
