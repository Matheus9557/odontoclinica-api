import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../config/jwt";

export function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "Token não fornecido.",
    });
  }

  const token = authHeader.substring(7);

  try {
    const payload = verifyToken(token);

    req.user = {
      id: payload.id,
      role: payload.role,
    };

    return next();
  } catch {
    return res.status(401).json({
      error: "Token inválido.",
    });
  }
}