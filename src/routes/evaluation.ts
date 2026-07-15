import { Router } from "express";
import { authenticate, onlyDentist } from "../middlewares/authMiddleware";

import {
  createEvaluation,
  getEvaluationsByPatient,
} from "../controllers/evaluationController";

const router = Router();


/**
 * @swagger
 * tags:
 *   name: Evaluation
 *   description: Avaliações e acompanhamento odontológico
 */


/**
 * @swagger
 * /evaluations/{patientId}:
 *   post:
 *     summary: Criar avaliação odontológica para um paciente
 *     description: >
 *       O dentista cria uma avaliação vinculada ao paciente.
 *       A avaliação possui acompanhamento previsto de 30 dias.
 *     tags:
 *       - Evaluation
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: patientId
 *         required: true
 *         description: ID do paciente
 *         schema:
 *           type: string
 *           example: cmr123abc456
 *     responses:
 *       200:
 *         description: Avaliação criada com sucesso
 *       401:
 *         description: Usuário não autenticado
 *       403:
 *         description: Apenas dentistas podem criar avaliações
 *       400:
 *         description: Erro ao criar avaliação
 */
router.post(
  "/:patientId",
  authenticate,
  onlyDentist,
  createEvaluation
);


/**
 * @swagger
 * /evaluations/patient/{patientId}:
 *   get:
 *     summary: Buscar avaliações de um paciente
 *     description: Retorna o histórico de avaliações odontológicas do paciente.
 *     tags:
 *       - Evaluation
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: patientId
 *         required: true
 *         schema:
 *           type: string
 *           example: cmr123abc456
 *     responses:
 *       200:
 *         description: Lista de avaliações
 *       401:
 *         description: Usuário não autenticado
 */
router.get(
  "/patient/:patientId",
  authenticate,
  getEvaluationsByPatient
);


export default router;