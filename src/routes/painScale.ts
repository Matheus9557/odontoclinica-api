import { Router } from "express";

import {
  createDailyPainEntry,
  getPatientPainHistory,
} from "../controllers/painScaleController";

import {
  authenticate,
  onlyPatient,
  onlyDentist,
} from "../middlewares/authMiddleware";

import { upload } from "../utils/multer";


const router = Router();


/**
 * @swagger
 * tags:
 *   name: Pain Scale
 *   description: Escala diária de dor e acompanhamento clínico
 */


/**
 * @swagger
 * /pain-scale:
 *   post:
 *     summary: Registrar escala diária de dor
 *     description: >
 *       O paciente envia diariamente sua escala de dor,
 *       comentário e imagem da região acompanhada.
 *     tags:
 *       - Pain Scale
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - scale
 *               - image
 *             properties:
 *               scale:
 *                 type: integer
 *                 example: 7
 *               comments:
 *                 type: string
 *                 example: Dor ao mastigar alimentos
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Registro criado
 *       400:
 *         description: Dados inválidos
 */
router.post(
  "/",
  authenticate,
  onlyPatient,
  upload.single("image"),
  createDailyPainEntry
);


/**
 * @swagger
 * /pain-scale/patient/{patientId}:
 *   get:
 *     summary: Buscar histórico de dor do paciente
 *     description: >
 *       Retorna registros utilizados para montar
 *       o gráfico de evolução da dor.
 *     tags:
 *       - Pain Scale
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: patientId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Histórico retornado
 */
router.get(
  "/patient/:patientId",
  authenticate,
  onlyDentist,
  getPatientPainHistory
);


export default router;