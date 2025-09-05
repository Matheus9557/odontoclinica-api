import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Buscar perfil do dentista logado
export const getDentistProfile = async (req: Request, res: Response) => {
  try {
    const dentistId = req.user!.id;

    const dentist = await prisma.dentist.findUnique({
      where: { id: dentistId },
      select: {
        id: true,
        name: true,
        email: true,
        cro: true,
        patients: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!dentist) return res.status(404).json({ error: 'Dentista não encontrado' });

    res.json(dentist);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar perfil do dentista.' });
  }
};

// Atualizar dentista logado
export const updateDentist = async (req: Request, res: Response) => {
  try {
    const dentistId = req.user!.id;
    const { name, email, password, cro } = req.body;

    const data: any = { name, email, cro };
    if (password) data.password = await bcrypt.hash(password, 10);

    const updated = await prisma.dentist.update({
      where: { id: dentistId },
      data,
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar dentista.' });
  }
};

// Excluir dentista logado + pacientes vinculados
export const deleteDentist = async (req: Request, res: Response) => {
  try {
    const dentistId = req.user!.id;

    // Apagar pacientes vinculados primeiro
    await prisma.patient.deleteMany({ where: { dentistId } });

    await prisma.dentist.delete({ where: { id: dentistId } });

    res.json({ message: 'Dentista e pacientes associados excluídos.' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao excluir dentista.' });
  }
};
