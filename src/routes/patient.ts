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

router.get('/me', authenticate, onlyPatient, getMe);
router.post('/', authenticate, onlyDentist, createPatient);
router.get('/', authenticate, onlyDentist, getPatientsByDentist);
router.put('/:id', authenticate, onlyDentist, updatePatient);
router.delete('/:id', authenticate, onlyDentist, deletePatient);




export default router;
