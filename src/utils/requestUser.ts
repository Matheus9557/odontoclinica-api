import { Request } from "express";
import { AppError } from "../errors/AppError";

export function getRequestUser(req: Request) {

  if (!req.user) {
    throw new AppError(
      "Usuário não autenticado",
      401
    );
  }

  return req.user;
}