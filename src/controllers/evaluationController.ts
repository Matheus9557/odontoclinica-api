import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Criar avaliação
export const createEvaluation = async (req: Request, res: Response) => {
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
};

// Listar avaliações de paciente
export const getEvaluationsByPatient = async (req: Request, res: Response) => {
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
};
