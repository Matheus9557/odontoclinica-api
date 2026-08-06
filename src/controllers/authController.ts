import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/authService";
import { AppError } from "../errors/AppError";

export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {}

  signupDentist = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result =
        await this.authService.signupDentist(req.body);

      return res.status(201).json(result);

    } catch (error) {
      next(error);
    }
  };

  signupPatient = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result =
        await this.authService.signupPatient(req.body);

      return res.status(201).json(result);

    } catch (error) {
      next(error);
    }
  };

  login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const {
            email,
            password,
            role
            } = req.body;

      const result =
        await this.authService.login(
          email,
          password,
          role
        );

      return res.json(result);

    } catch (error) {
      next(error);
    }
  };

  me = async (
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

      const result =
        await this.authService.me(
          req.user.id,
          req.user.role
        );

      return res.json(result);

    } catch (error) {
      next(error);
    }
  };
}