import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";
import { logger } from "../lib/logger";

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {

  if (err instanceof AppError) {

    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
    });

  }

  logger.error(
  {
    err,
    name: err.name,
    message: err.message,
    stack: err.stack,
  },
  "Erro interno não tratado"
);

  return res.status(500).json({
    success: false,
    error: "Erro interno do servidor.",
  });

}