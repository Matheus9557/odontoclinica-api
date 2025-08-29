import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Registrar escala de dor
export const registerPainScale = async (req: Request, res: Response) => {
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

// Listar escalas de dor
export const getPainScalesByEvaluation = async (req: Request, res: Response) => {
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

// Gerar gráfico (dados simplificados)
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
