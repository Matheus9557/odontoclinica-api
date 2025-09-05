import { Router } from 'express';
import { signupDentist, signupPatient, login } from '../controllers/authController';

const router = Router();

router.post('/signup/dentist', signupDentist);
router.post('/signup/patient', signupPatient);
router.post('/login', login);

export default router;
