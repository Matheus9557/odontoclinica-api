import { Router } from 'express';
import { authenticate, onlyDentist } from '../middlewares/authMiddleware';
import { createDentist, getDentistProfile } from '../controllers/dentistController';

const router = Router();

// Criar dentista (ex: registro inicial)
router.post('/', createDentist);

// Ver perfil do dentista autenticado
router.get('/me', authenticate, onlyDentist, getDentistProfile);

export default router;
