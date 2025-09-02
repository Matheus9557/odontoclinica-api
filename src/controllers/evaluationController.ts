import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Criar nova avaliação
export const createEvaluation = async (req: Request, res: Response) => {
  const { patientId, startDate, endDate } = req.body;

  try {
    const evaluation = await prisma.evaluation.create({
      data: { patientId, startDate: new Date(startDate), endDate: new Date(endDate) },
    });
    res.json(evaluation);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao criar avaliação' });
  }
};

// Listar avaliações por paciente
export const getEvaluationsByPatient = async (req: Request, res: Response) => {
  const { patientId } = req.params;

  try {
    const evaluations = await prisma.evaluation.findMany({
      where: { patientId },
      include: { painScaleEntries: true },
    });
    res.json(evaluations);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao buscar avaliações' });
  }
};

// Registrar escala de dor (PainScaleEntry)
export const addPainEntry = async (req: Request, res: Response) => {
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
};

// Listar escalas de dor por avaliação
export const getPainEntries = async (req: Request, res: Response) => {
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
};

// Gerar gráfico de dor simplificado
export const getPainChart = async (req: Request, res: Response) => {
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
};
