import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";

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

  console.error(err);

  return res.status(500).json({
    success: false,
    error: "Erro interno do servidor.",
  });

}