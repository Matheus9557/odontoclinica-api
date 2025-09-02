import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Criar dentista (ex: cadastro inicial)
export const createDentist = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const dentist = await prisma.dentist.create({
      data: { name, email, password: hashedPassword },
    });

    res.json(dentist);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar dentista.' });
  }
};

// Buscar dentista logado
export const getDentistProfile = async (req: Request, res: Response) => {
  try {
    const dentistId = req.user!.id;

    const dentist = await prisma.dentist.findUnique({
      where: { id: dentistId },
      select: {
        id: true,
        name: true,
        email: true,
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
