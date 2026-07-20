import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/authService";
import { AppError } from "../errors/AppError";

const authService = new AuthService();

/* ---------------------- SIGNUP DENTISTA ---------------------- */

export const signupDentist = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await authService.signupDentist(req.body);

    return res.status(201).json(result);

  } catch (error) {
    next(error);
  }
};


/* ---------------------- SIGNUP PACIENTE ---------------------- */

export const signupPatient = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {

    const result =
      await authService.signupPatient(req.body);

    return res.status(201).json(result);

  } catch (error) {
    next(error);
  }
};


/* ---------------------- LOGIN ---------------------- */

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  try {

    const {
      email,
      password,
      role,
    } = req.body;

    const result =
      await authService.login(
        email,
        password,
        role
      );

    return res.status(200).json(result);

  } catch (error) {
    next(error);
  }

};


/* ---------------------- USUÁRIO LOGADO ---------------------- */

export const me = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  try {

    if (!req.user) {
      throw new AppError(
        "Não autenticado",
        401
      );
    }

    const {
      id,
      role,
    } = req.user;

    const result =
      await authService.me(
        id,
        role
      );

    return res.status(200).json(result);

  } catch (error) {
    next(error);
  }

};