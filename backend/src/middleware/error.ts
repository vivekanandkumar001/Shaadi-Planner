import { Request, Response, NextFunction } from "express"

export function errorHandler(err: any, req: Request, res: Response, _next: NextFunction): void {
  console.error("🔥 Global Backend Error:", err)

  const statusCode = err.statusCode || err.status || 500
  const message = process.env.NODE_ENV === "production" && statusCode === 500
    ? "An internal server error occurred."
    : err.message || "Internal Server Error"

  res.status(statusCode).json({
    success: false,
    error: {
      code: err.code || "INTERNAL_ERROR",
      message,
      ...(process.env.NODE_ENV !== "production" && err.stack ? { stack: err.stack } : {}),
    },
  })
}
