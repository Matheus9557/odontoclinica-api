import { Router } from 'express';
import { authenticate, onlyDentist, onlyPatient } from '../middlewares/authMiddleware';
import { 
  createEvaluation, addPainEntry, getPainEntries, getPainChart, getEvaluationsByPatient 
} from '../controllers/evaluationController';

const router = Router();

// Dentista cria avaliação
router.post('/:patientId', authenticate, onlyDentist, createEvaluation);

// Paciente registra dor
router.post('/pain/:evaluationId', authenticate, onlyPatient, addPainEntry);

// Buscar escalas de dor
router.get('/pain/:evaluationId', authenticate, getPainEntries);

// Gráfico de dor
router.get('/pain-chart/:evaluationId', authenticate, getPainChart);

// Avaliações de paciente
router.get('/patient/:patientId', authenticate, getEvaluationsByPatient);

export default router;
