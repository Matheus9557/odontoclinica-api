import { Request, Response } from "express";
import { AuthService } from "../services/authService";

const authService = new AuthService();

/* ---------------------- SIGNUP DENTISTA ---------------------- */
export const signupDentist = async (req: Request, res: Response) => {
  try {
    const result = await authService.signupDentist(req.body);

    return res.status(201).json(result);
  } catch (error) {
    if (error instanceof Error) {
      if (
        error.message === "CRO inválido." ||
        error.message === "E-mail já cadastrado."
      ) {
        return res.status(400).json({
          error: error.message,
        });
      }
    }

    return res.status(500).json({
      error: "Erro ao cadastrar dentista",
    });
  }
};


/* ---------------------- SIGNUP PACIENTE ---------------------- */
export const signupPatient = async (req: Request, res: Response) => {
  try {
    const result = await authService.signupPatient(req.body);

    return res.status(201).json(result);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({
        error: error.message,
      });
    }

    return res.status(500).json({
      error: "Erro ao cadastrar paciente",
    });
  }
};

/* ---------------------- LOGIN ---------------------- */
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password, role } = req.body;

    const result = await authService.login(
      email,
      password,
      role
    );

    return res.status(200).json(result);

  } catch (error) {
    if (error instanceof Error) {
      return res.status(401).json({
        error: error.message,
      });
    }

    return res.status(500).json({
      error: "Erro no login",
    });
  }
};

/* ---------------------- ME (USUÁRIO LOGADO) ---------------------- */
export const me = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: "Não autenticado",
      });
    }

    const { id, role } = req.user;

    const user = await authService.me(
      id,
      role
    );

    return res.status(200).json(user);

  } catch (error) {
    if (error instanceof Error) {
      return res.status(404).json({
        error: error.message,
      });
    }

    return res.status(500).json({
      error: "Erro ao buscar usuário",
    });
  }
};