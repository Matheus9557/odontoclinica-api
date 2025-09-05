import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Avaliação
export const createEvaluation = async (req: Request, res: Response) => {
  const { patientId } = req.params;
  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(startDate.getDate() + 30);

  try {
    const evaluation = await prisma.evaluation.create({ data: { patientId, startDate, endDate } });
    res.json(evaluation);
  } catch {
    res.status(400).json({ error: 'Erro ao criar avaliação' });
  }
};

// Escala de dor
export const addPainEntry = async (req: Request, res: Response) => {
  const { evaluationId } = req.params;
  const { scale } = req.body;
  try {
    const entry = await prisma.painScaleEntry.create({
      data: { evaluationId, scale: parseInt(scale), date: new Date() },
    });
    res.json(entry);
  } catch {
    res.status(400).json({ error: 'Erro ao registrar escala de dor' });
  }
};

// Listar escalas
export const getPainEntries = async (req: Request, res: Response) => {
  const { evaluationId } = req.params;
  try {
    const entries = await prisma.painScaleEntry.findMany({
      where: { evaluationId },
      orderBy: { date: 'asc' },
    });
    res.json(entries);
  } catch {
    res.status(400).json({ error: 'Erro ao buscar dados de dor' });
  }
};

// Gráfico simplificado
export const getPainChart = async (req: Request, res: Response) => {
  const { evaluationId } = req.params;
  try {
    const entries = await prisma.painScaleEntry.findMany({
      where: { evaluationId },
      orderBy: { date: 'asc' },
    });
    res.json(entries.map(e => ({ date: e.date.toISOString().split('T')[0], scale: e.scale })));
  } catch {
    res.status(400).json({ error: 'Erro ao gerar gráfico' });
  }
};

// Avaliações de paciente
export const getEvaluationsByPatient = async (req: Request, res: Response) => {
  const { patientId } = req.params;
  try {
    const evaluations = await prisma.evaluation.findMany({
      where: { patientId },
      orderBy: { startDate: 'desc' },
    });
    res.json(evaluations);
  } catch {
    res.status(500).json({ error: 'Erro ao buscar avaliações' });
  }
};
