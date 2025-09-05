import { Router } from 'express';
import { authenticate, onlyDentist } from '../middlewares/authMiddleware';
import {
  createPatient,
  getPatientsByDentist,
  updatePatient,
  deletePatient
} from '../controllers/patientController';

const router = Router();

// Criar paciente
router.post('/', authenticate, onlyDentist, createPatient);

// Listar pacientes do dentista logado
router.get('/', authenticate, onlyDentist, getPatientsByDentist);

// Atualizar paciente
router.put('/:id', authenticate, onlyDentist, updatePatient);

// Excluir paciente
router.delete('/:id', authenticate, onlyDentist, deletePatient);

export default router;
