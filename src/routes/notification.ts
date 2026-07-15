import { Router } from "express";

import {
  authenticate,
} from "../middlewares/authMiddleware";

import {
  getUnreadCount,
  markAllAsRead,
} from "../controllers/notificationController";


const router = Router();


/**
 * @swagger
 * tags:
 *   name: Notification
 *   description: Sistema de notificações
 */


/**
 * @swagger
 * /notifications/unread-count:
 *   get:
 *     summary: Quantidade de notificações não lidas
 *     tags:
 *       - Notification
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Quantidade retornada
 */
router.get(
  "/unread-count",
  authenticate,
  getUnreadCount
);


/**
 * @swagger
 * /notifications/read-all:
 *   patch:
 *     summary: Marcar notificações como lidas
 *     tags:
 *       - Notification
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notificações atualizadas
 */
router.patch(
  "/read-all",
  authenticate,
  markAllAsRead
);


export default router;