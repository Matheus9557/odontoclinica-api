import { Router } from "express";

import { authenticate } from "../middlewares/authenticate";

import { messageController } from "../container";

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
router.post("/send", authenticate, messageController.sendMessage);

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
router.get("/", authenticate, messageController.getMessages);

export default router;
