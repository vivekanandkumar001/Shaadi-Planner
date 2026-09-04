import app from "./app"
import { env } from "./config"
import { prisma } from "./db/prisma"

const PORT = parseInt(process.env.PORT || env.PORT || "5000", 10)

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Shaadi Planner API Server running on 0.0.0.0:${PORT} [${env.NODE_ENV}]`)
})

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("Shutting down server gracefully...")
  await prisma.$disconnect()
  server.close(() => {
    process.exit(0)
  })
})

process.on("SIGTERM", async () => {
  console.log("Shutting down server gracefully...")
  await prisma.$disconnect()
  server.close(() => {
    process.exit(0)
  })
})
