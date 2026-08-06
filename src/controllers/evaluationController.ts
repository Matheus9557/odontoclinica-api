import { Request, Response, NextFunction } from "express";
import { EvaluationService } from "../services/evaluationService";
import { getRequestUser } from "../utils/requestUser";

export class EvaluationController {

  constructor(
    private readonly evaluationService: EvaluationService
  ) {}

  createEvaluation = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {

      const evaluation =
        await this.evaluationService.createEvaluation({
          dentistId: getRequestUser(req).id,
          patientId: req.params.patientId,
        });

      return res
        .status(201)
        .json(evaluation);

    } catch (error) {
      next(error);
    }
  };


  getEvaluationsByPatient = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {

      const evaluations =
        await this.evaluationService.getEvaluationsByPatient({
          dentistId: getRequestUser(req).id,
          patientId: req.params.patientId,
        });

      return res.json(evaluations);

    } catch (error) {
      next(error);
    }
  };
}