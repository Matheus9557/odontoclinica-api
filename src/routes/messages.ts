import { Router } from "express";

import {
  authenticate,
} from "../middlewares/authMiddleware";

import {
  sendMessage,
  getMessages,
} from "../controllers/messageController";


const router = Router();


/**
 * @swagger
 * tags:
 *   name: Messages
 *   description: Comunicação entre paciente e dentista
 */


/**
 * @swagger
 * /messages/send:
 *   post:
 *     summary: Enviar mensagem
 *     description: Envia mensagem entre usuários autenticados.
 *     tags:
 *       - Messages
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Mensagem enviada
 */
router.post(
  "/send",
  authenticate,
  sendMessage
);


/**
 * @swagger
 * /messages:
 *   get:
 *     summary: Buscar mensagens
 *     description: Retorna histórico do chat.
 *     tags:
 *       - Messages
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Mensagens encontradas
 */
router.get(
  "/",
  authenticate,
  getMessages
);


export default router;