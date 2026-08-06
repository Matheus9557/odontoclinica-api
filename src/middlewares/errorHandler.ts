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
    logger.warn(
      {
        statusCode: err.statusCode,
        message: err.message,
      },
      "Erro de aplicação"
    );

    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
    });
  }

  logger.error(
    { err },
    "Erro interno"
  );

  return res.status(500).json({
    success: false,
    error:
      process.env.NODE_ENV === "production"
        ? "Erro interno do servidor."
        : err.message,
    ...(process.env.NODE_ENV !== "production" && {
      stack: err.stack,
    }),
  });
}