import { Router } from 'express';
import { authenticate, onlyPatient, onlyDentist } from '../middlewares/authMiddleware';
import { upload } from '../utils/multer';
import { uploadImage, getImagesByEvaluation, getImagesByPatient } from '../controllers/imageController';

const router = Router();

// Upload de imagem (Paciente ou Dentista)
router.post('/:patientId/:evaluationId', authenticate, upload.single('file'), uploadImage);

// Listar imagens de uma avaliação
router.get('/evaluation/:evaluationId', authenticate, getImagesByEvaluation);

// Listar imagens de um paciente
router.get('/patient/:patientId', authenticate, getImagesByPatient);

export default router;
