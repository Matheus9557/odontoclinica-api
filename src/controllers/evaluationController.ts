import { Request, Response } from "express";

import { EvaluationService } from "../services/evaluationService";

const evaluationService = new EvaluationService();

export const createEvaluation = async (
  req: Request,
  res: Response
) => {
  try {
    const evaluation =
      await evaluationService.createEvaluation({
        dentistId: req.user!.id,
        patientId: req.params.patientId,
      });

    return res.status(201).json(evaluation);

  } catch (error) {
    console.error("createEvaluation error:", error);

    if (error instanceof Error) {

      if (
        error.message === "Paciente não encontrado."
      ) {
        return res.status(404).json({
          error: error.message,
        });
      }

      if (
        error.message ===
        "Paciente não pertence a este dentista."
      ) {
        return res.status(403).json({
          error: error.message,
        });
      }
    }

    return res.status(500).json({
      error: "Erro ao criar avaliação.",
    });
  }
};

export const getEvaluationsByPatient = async (
  req: Request,
  res: Response
) => {
  try {
    const evaluations =
      await evaluationService.getEvaluationsByPatient({
        dentistId: req.user!.id,
        patientId: req.params.patientId,
      });

    return res.json(evaluations);

  } catch (error) {
    console.error(
      "getEvaluationsByPatient error:",
      error
    );

    if (error instanceof Error) {

      if (
        error.message === "Paciente não encontrado."
      ) {
        return res.status(404).json({
          error: error.message,
        });
      }

      if (
        error.message ===
        "Paciente não pertence a este dentista."
      ) {
        return res.status(403).json({
          error: error.message,
        });
      }
    }

    return res.status(500).json({
      error: "Erro ao buscar avaliações.",
    });
  }
};