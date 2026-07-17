import { Request, Response } from "express";

import { PatientService } from "../services/patientService";

const patientService = new PatientService();

// Criar paciente
export const createPatient = async (
  req: Request,
  res: Response
) => {
  try {
    const patient =
      await patientService.createPatient({
        dentistId: req.user!.id,
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      });

    return res.status(201).json(patient);

  } catch (error) {
    console.error("createPatient error:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Erro ao criar paciente.";

    if (
      message ===
      "Nome, email e senha são obrigatórios."
    ) {
      return res.status(400).json({
        error: message,
      });
    }

    if (
      message ===
      "Paciente com este e-mail já existe."
    ) {
      return res.status(409).json({
        error: message,
      });
    }

    return res.status(500).json({
      error: "Erro ao criar paciente.",
    });
  }
};

// Listar pacientes do dentista
export const getPatientsByDentist = async (
  req: Request,
  res: Response
) => {
  try {
    const patients =
      await patientService.getPatientsByDentist(
        req.user!.id
      );

    return res.json(patients);

  } catch (error) {
    console.error(
      "getPatientsByDentist error:",
      error
    );

    return res.status(500).json({
      error: "Erro ao buscar pacientes.",
    });
  }
};

// Atualizar paciente
export const updatePatient = async (
  req: Request,
  res: Response
) => {
  try {
    const patient =
      await patientService.updatePatient({
        dentistId: req.user!.id,
        patientId: req.params.id,
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      });

    return res.json(patient);

  } catch (error) {
    console.error("updatePatient error:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Erro ao atualizar paciente.";

    if (message === "Acesso negado.") {
      return res.status(403).json({
        error: message,
      });
    }

    return res.status(500).json({
      error: "Erro ao atualizar paciente.",
    });
  }
};

// Excluir paciente
export const deletePatient = async (
  req: Request,
  res: Response
) => {
  try {
    const result =
      await patientService.deletePatient({
        dentistId: req.user!.id,
        patientId: req.params.id,
      });

    return res.json(result);

  } catch (error) {
    console.error("deletePatient error:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Erro ao excluir paciente.";

    if (message === "Acesso negado.") {
      return res.status(403).json({
        error: message,
      });
    }

    return res.status(500).json({
      error: "Erro ao excluir paciente.",
    });
  }
};

// Perfil do paciente logado
export const getMe = async (
  req: Request,
  res: Response
) => {
  try {
    const patient =
      await patientService.getMe(
        req.user!.id
      );

    return res.json(patient);

  } catch (error) {
    console.error("getMe error:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Erro ao buscar paciente.";

    if (
      message ===
      "Paciente não encontrado."
    ) {
      return res.status(404).json({
        error: message,
      });
    }

    return res.status(500).json({
      error: "Erro ao buscar paciente.",
    });
  }
};