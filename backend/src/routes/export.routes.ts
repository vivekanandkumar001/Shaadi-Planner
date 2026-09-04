import { Router } from "express"
import { prisma } from "../db/prisma"
import { requireAuth, requireWeddingOwner, AuthRequest } from "../middleware/auth"

const router = Router()

router.get("/:weddingId/csv/:type", requireAuth, requireWeddingOwner, async (req: AuthRequest, res, next) => {
  try {
    const { weddingId } = req
    const { type } = req.params

    let csvContent = ""
    let filename = `shaadi_${type}_${Date.now()}.csv`

    if (type === "guests") {
      const guests = await prisma.guest.findMany({
        where: { weddingId },
        include: { table: true },
        orderBy: { name: "asc" },
      })

      csvContent = "Name,Side,RSVP,Meal Preference,Plus Ones,Phone,Table,Notes\n"
      guests.forEach((g) => {
        csvContent += `"${g.name}","${g.side}","${g.rsvp}","${g.meal}",${g.plusOnes},"${g.phone || ""}","${g.table?.name || "Unassigned"}","${(g.notes || "").replace(/"/g, '""')}"\n`
      })
    } else if (type === "vendors") {
      const vendors = await prisma.vendor.findMany({
        where: { weddingId },
        orderBy: { name: "asc" },
      })

      csvContent = "Vendor Name,Category,Contact,Quoted Amount (INR),Paid Amount (INR),Status,Notes\n"
      vendors.forEach((v) => {
        csvContent += `"${v.name}","${v.category}","${v.contact || ""}",${Number(v.quotedAmount)},${Number(v.paidAmount)},"${v.status}","${(v.notes || "").replace(/"/g, '""')}"\n`
      })
    } else if (type === "functions") {
      const functions = await prisma.weddingFunction.findMany({
        where: { weddingId },
        orderBy: { createdAt: "asc" },
      })

      csvContent = "Function Name,Hindi Name,Date,Time,Venue,Dresscode,Notes\n"
      functions.forEach((f) => {
        csvContent += `"${f.name}","${f.hindiName || ""}","${f.date || ""}","${f.time || ""}","${f.venue || ""}","${f.dresscode || ""}","${(f.notes || "").replace(/"/g, '""')}"\n`
      })
    } else if (type === "checklist") {
      const tasks = await prisma.checklistItem.findMany({
        where: { weddingId },
        orderBy: { createdAt: "asc" },
      })

      csvContent = "Task Description,Category,Priority,Due Date,Status\n"
      tasks.forEach((t) => {
        csvContent += `"${t.task.replace(/"/g, '""')}","${t.category}","${t.priority}","${t.dueDate || ""}","${t.done ? "Completed" : "Pending"}"\n`
      })
    } else {
      res.status(400).json({ success: false, error: { code: "INVALID_EXPORT_TYPE", message: "Invalid export type requested." } })
      return
    }

    res.setHeader("Content-Type", "text/csv")
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`)
    res.status(200).send(csvContent)
  } catch (error) {
    next(error)
  }
})

export default router
