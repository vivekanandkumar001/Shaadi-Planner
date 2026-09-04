import { Request, Response, NextFunction } from "express"
import { AnyZodObject, ZodError } from "zod"

export function validate(schema: AnyZodObject) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      })
      next()
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedFields: Record<string, string> = {}
        error.errors.forEach((err) => {
          const path = err.path.slice(1).join(".") || err.path.join(".")
          formattedFields[path] = err.message
        })

        res.status(400).json({
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Validation failed for request parameters.",
            fields: formattedFields,
          },
        })
        return
      }
      next(error)
    }
  }
}
