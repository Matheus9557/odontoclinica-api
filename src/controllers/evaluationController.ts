import { Request, Response, NextFunction } from "express";
import { EvaluationService } from "../services/evaluationService";

const evaluationService = new EvaluationService();

export const createEvaluation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const evaluation = await evaluationService.createEvaluation({
      dentistId: req.user!.id,
      patientId: req.params.patientId,
    });

    return res.status(201).json(evaluation);
  } catch (error) {
    next(error);
  }
};

export const getEvaluationsByPatient = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const evaluations =
      await evaluationService.getEvaluationsByPatient({
        dentistId: req.user!.id,
        patientId: req.params.patientId,
      });

    return res.json(evaluations);
  } catch (error) {
    next(error);
  }
};