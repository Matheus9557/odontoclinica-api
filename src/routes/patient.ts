import { Router } from 'express';
import { authenticate, onlyDentist, onlyPatient } from '../middlewares/authMiddleware';

import {
  createPatient,
  getPatientsByDentist,
  updatePatient,
  deletePatient,
  getMe
} from '../controllers/patientController';

const router = Router();


/**
 * @swagger
 * tags:
 *   name: Patient
 *   description: Gerenciamento de pacientes e vínculo com dentistas
 */


/**
 * @swagger
 * /patients/me:
 *   get:
 *     summary: Buscar perfil do paciente autenticado
 *     description: Retorna os dados do paciente atualmente logado.
 *     tags:
 *       - Patient
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dados do paciente encontrados
 *       401:
 *         description: Usuário não autenticado
 *       403:
 *         description: Usuário não possui permissão de paciente
 *       404:
 *         description: Paciente não encontrado
 */
router.get('/me', authenticate, onlyPatient, getMe);


/**
 * @swagger
 * /patients:
 *   post:
 *     summary: Criar paciente
 *     description: >
 *       Cria um paciente vinculado automaticamente ao dentista autenticado.
 *       Um paciente pertence a apenas um dentista.
 *     tags:
 *       - Patient
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Maria Souza
 *               email:
 *                 type: string
 *                 example: maria@email.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       201:
 *         description: Paciente criado com sucesso
 *       400:
 *         description: Dados obrigatórios ausentes
 *       401:
 *         description: Usuário não autenticado
 *       403:
 *         description: Usuário não possui permissão de dentista
 *       409:
 *         description: Paciente já cadastrado
 */
router.post('/', authenticate, onlyDentist, createPatient);


/**
 * @swagger
 * /patients:
 *   get:
 *     summary: Listar pacientes do dentista autenticado
 *     description: Retorna somente pacientes vinculados ao dentista logado.
 *     tags:
 *       - Patient
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pacientes retornada com sucesso
 *       401:
 *         description: Usuário não autenticado
 *       403:
 *         description: Usuário não possui permissão de dentista
 */
router.get('/', authenticate, onlyDentist, getPatientsByDentist);


/**
 * @swagger
 * /patients/{id}:
 *   put:
 *     summary: Atualizar paciente
 *     description: Atualiza os dados de um paciente pertencente ao dentista autenticado.
 *     tags:
 *       - Patient
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do paciente
 *         schema:
 *           type: string
 *           example: cmr123abc456
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Maria Atualizada
 *               email:
 *                 type: string
 *                 example: maria2@email.com
 *               password:
 *                 type: string
 *                 example: novaSenha123
 *     responses:
 *       200:
 *         description: Paciente atualizado com sucesso
 *       401:
 *         description: Usuário não autenticado
 *       403:
 *         description: Paciente não pertence ao dentista autenticado
 *       404:
 *         description: Paciente não encontrado
 */
router.put('/:id', authenticate, onlyDentist, updatePatient);


/**
 * @swagger
 * /patients/{id}:
 *   delete:
 *     summary: Excluir paciente
 *     description: Remove um paciente vinculado ao dentista autenticado.
 *     tags:
 *       - Patient
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do paciente
 *         schema:
 *           type: string
 *           example: cmr123abc456
 *     responses:
 *       200:
 *         description: Paciente removido com sucesso
 *       401:
 *         description: Usuário não autenticado
 *       403:
 *         description: Paciente não pertence ao dentista autenticado
 *       404:
 *         description: Paciente não encontrado
 */
router.delete('/:id', authenticate, onlyDentist, deletePatient);


export default router;