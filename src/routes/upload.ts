import { Router } from "express";

import {
  upload,
} from "../utils/multer";

import {
  authenticate,
} from "../middlewares/authMiddleware";

import {
  handleUpload,
  uploadAvatar,
} from "../controllers/uploadController";


const router = Router();


/**
 * @swagger
 * tags:
 *   name: Upload
 *   description: Upload de arquivos e imagens
 */


/**
 * @swagger
 * /upload:
 *   post:
 *     summary: Upload de arquivo
 *     description: Upload genérico de imagens clínicas.
 *     tags:
 *       - Upload
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Arquivo enviado
 */
router.post(
  "/",
  authenticate,
  upload.single("file"),
  handleUpload
);


/**
 * @swagger
 * /upload/avatar:
 *   post:
 *     summary: Upload de avatar
 *     tags:
 *       - Upload
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Avatar atualizado
 */
router.post(
  "/avatar",
  authenticate,
  upload.single("avatar"),
  uploadAvatar
);


export default router;