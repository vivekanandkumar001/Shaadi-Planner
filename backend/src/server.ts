import { prisma } from "./db/prisma"
import app from "./app"
import { env } from "./config"

const PORT = Number(process.env.PORT || env.PORT || 5000)

console.log("Starting Shaadi Planner backend...")
console.log(`NODE_ENV=${env.NODE_ENV}`)
console.log(`PORT=${PORT}`)

process.on("uncaughtException", (error) => {
  console.error("UNCAUGHT EXCEPTION:")
  console.error(error)
  process.exit(1)
})

process.on("unhandledRejection", (reason) => {
  console.error("UNHANDLED REJECTION:")
  console.error(reason)
  process.exit(1)
})

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(
    `Shaadi Planner API Server running on 0.0.0.0:${PORT} [${env.NODE_ENV}]`,
  )
})

server.on("error", (error) => {
  console.error("HTTP SERVER ERROR:")
  console.error(error)
  process.exit(1)
})

const shutdown = async (signal: string) => {
  console.log(`Received ${signal}. Shutting down gracefully...`)

  server.close(async () => {
    try {
      await prisma.$disconnect()
      console.log("Database disconnected.")
      process.exit(0)
    } catch (error) {
      console.error("Error while disconnecting database:")
      console.error(error)
      process.exit(1)
    }
  })
}

process.on("SIGINT", () => {
  void shutdown("SIGINT")
})

process.on("SIGTERM", () => {
  void shutdown("SIGTERM")
})