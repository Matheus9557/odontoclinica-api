import { Router } from "express";
import {
  signupDentist,
  signupPatient,
  login,
} from "../controllers/authController";

const router = Router();

console.log("🔥 Rotas de autenticação carregadas!");

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Autenticação e cadastro de usuários
 */


/**
 * @swagger
 * /auth/signup/dentist:
 *   post:
 *     summary: Cadastro de dentista
 *     description: Cria uma nova conta de dentista na plataforma.
 *     tags:
 *       - Auth
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
 *               - cro
 *             properties:
 *               name:
 *                 type: string
 *                 example: Dr João Silva
 *               email:
 *                 type: string
 *                 example: joao@email.com
 *               password:
 *                 type: string
 *                 example: 123456
 *               cro:
 *                 type: string
 *                 example: 123456-PB
 *     responses:
 *       201:
 *         description: Dentista cadastrado com sucesso
 *       400:
 *         description: Dados inválidos
 *       409:
 *         description: E-mail já cadastrado
 */
router.post("/signup/dentist", signupDentist);


/**
 * @swagger
 * /auth/signup/patient:
 *   post:
 *     summary: Cadastro de paciente
 *     description: Cria um paciente vinculado a um dentista existente.
 *     tags:
 *       - Auth
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
 *               - dentistId
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
 *               dentistId:
 *                 type: string
 *                 example: cmr123abc456
 *     responses:
 *       201:
 *         description: Paciente cadastrado com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Dentista não encontrado
 *       409:
 *         description: E-mail já cadastrado
 */
router.post("/signup/patient", signupPatient);


/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login de usuário
 *     description: Autentica dentistas e pacientes utilizando email, senha e tipo de usuário.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - role
 *             properties:
 *               email:
 *                 type: string
 *                 example: joao@email.com
 *               password:
 *                 type: string
 *                 example: 123456
 *               role:
 *                 type: string
 *                 enum:
 *                   - dentist
 *                   - patient
 *                 example: dentist
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *       401:
 *         description: Credenciais inválidas
 */
router.post("/login", login);


export default router;