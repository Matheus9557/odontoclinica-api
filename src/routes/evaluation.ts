import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();
const prisma = new PrismaClient();

// Criar nova avaliação (Dentista)
router.post('/:patientId', authenticate, async (req: Request, res: Response) => {
  const { patientId } = req.params;
  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(startDate.getDate() + 30);

  try {
    const evaluation = await prisma.evaluation.create({
      data: { patientId, startDate, endDate },
    });
    res.json(evaluation);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao criar avaliação' });
  }
});

// Registrar escala de dor (Paciente)
router.post('/pain/:evaluationId', authenticate, async (req: Request, res: Response) => {
  const { evaluationId } = req.params;
  const { scale } = req.body;
  const date = new Date();

  try {
    const entry = await prisma.painScaleEntry.create({
      data: { evaluationId, date, scale: parseInt(scale) },
    });
    res.json(entry);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao registrar escala de dor' });
  }
});

// Buscar todas escalas de dor de uma avaliação
router.get('/pain/:evaluationId', authenticate, async (req: Request, res: Response) => {
  const { evaluationId } = req.params;

  try {
    const entries = await prisma.painScaleEntry.findMany({
      where: { evaluationId },
      orderBy: { date: 'asc' },
    });
    res.json(entries);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao buscar dados de dor' });
  }
});

// Gerar gráfico de dor
router.get('/pain-chart/:evaluationId', authenticate, async (req: Request, res: Response) => {
  const { evaluationId } = req.params;

  try {
    const entries = await prisma.painScaleEntry.findMany({
      where: { evaluationId },
      orderBy: { date: 'asc' },
    });

    const result = entries.map(entry => ({
      date: entry.date.toISOString().split('T')[0],
      scale: entry.scale,
    }));

    res.json(result);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao gerar gráfico' });
  }
});

// Listar avaliações de um paciente
router.get('/patient/:patientId', authenticate, async (req: Request, res: Response) => {
  const { patientId } = req.params;

  try {
    const evaluations = await prisma.evaluation.findMany({
      where: { patientId },
      orderBy: { startDate: 'desc' },
    });
    res.json(evaluations);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar avaliações' });
  }
});

export default router;
