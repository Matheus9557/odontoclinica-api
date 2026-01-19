import { Router } from 'express';
import { authenticate, onlyDentist } from '../middlewares/authMiddleware';
import {
  
  getDentistProfile,
  updateDentist,
  deleteDentist
} from '../controllers/dentistController';

const router = Router();


// Ver perfil do dentista autenticado
router.get('/me', authenticate, onlyDentist, getDentistProfile);

// Atualizar dentista
router.put('/:id', authenticate, onlyDentist, updateDentist);

// Excluir dentista
router.delete('/:id', authenticate, onlyDentist, deleteDentist);

export default router;
