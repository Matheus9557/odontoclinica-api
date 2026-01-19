import { Router } from "express";
import { authenticate, onlyDentist } from "../middlewares/authMiddleware";
import {
  createEvaluation,
  getEvaluationsByPatient,
} from "../controllers/evaluationController";

const router = Router();

// Dentista cria avaliação
router.post("/:patientId", authenticate, onlyDentist, createEvaluation);

// Avaliações de um paciente
router.get("/patient/:patientId", authenticate, getEvaluationsByPatient);

export default router;
