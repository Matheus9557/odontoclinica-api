import { Router } from 'express';
import { authenticate } from "../middlewares/authenticate";
import { authorize } from "../middlewares/authorize";
import {
  getDentistProfile,
  updateDentist,
  deleteDentist
} from '../controllers/dentistController';

const router = Router();


/**
 * @swagger
 * tags:
 *   name: Dentist
 *   description: Gerenciamento do perfil do dentista
 */


/**
 * @swagger
 * /dentists/me:
 *   get:
 *     summary: Buscar perfil do dentista autenticado
 *     description: Retorna os dados do dentista atualmente logado e seus pacientes vinculados.
 *     tags:
 *       - Dentist
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil encontrado com sucesso
 *       401:
 *         description: Usuário não autenticado
 *       403:
 *         description: Usuário não possui permissão de dentista
 *       404:
 *         description: Dentista não encontrado
 */
router.get('/me', authenticate, authorize("dentist"), getDentistProfile);


/**
 * @swagger
 * /dentists/{id}:
 *   put:
 *     summary: Atualizar dados do dentista
 *     description: Atualiza informações do dentista autenticado.
 *     tags:
 *       - Dentist
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do dentista
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
 *                 example: Dr João Silva
 *               email:
 *                 type: string
 *                 example: joao@email.com
 *               password:
 *                 type: string
 *                 example: novaSenha123
 *               cro:
 *                 type: string
 *                 example: 123456-PB
 *     responses:
 *       200:
 *         description: Dentista atualizado com sucesso
 *       401:
 *         description: Usuário não autenticado
 *       403:
 *         description: Usuário não possui permissão de dentista
 *       404:
 *         description: Dentista não encontrado
 */
router.put('/:id', authenticate, authorize("dentist"), updateDentist);


/**
 * @swagger
 * /dentists/{id}:
 *   delete:
 *     summary: Excluir dentista
 *     description: Remove o dentista autenticado e seus pacientes associados.
 *     tags:
 *       - Dentist
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do dentista
 *         schema:
 *           type: string
 *           example: cmr123abc456
 *     responses:
 *       200:
 *         description: Dentista excluído com sucesso
 *       401:
 *         description: Usuário não autenticado
 *       403:
 *         description: Usuário não possui permissão de dentista
 *       404:
 *         description: Dentista não encontrado
 */
router.delete('/:id', authenticate, authorize("dentist"), deleteDentist);


export default router;