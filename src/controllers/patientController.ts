import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Criar paciente
export const createPatient = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // O dentista logado vai ser dono do paciente
    const dentistId = req.user!.id;

    const hashedPassword = await bcrypt.hash(password, 10);

    const patient = await prisma.patient.create({
      data: { name, email, password: hashedPassword, dentistId },
    });

    res.json(patient);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar paciente.' });
  }
};

// Listar pacientes de um dentista
export const getPatientsByDentist = async (req: Request, res: Response) => {
  try {
    const dentistId = req.user!.id;

    const patients = await prisma.patient.findMany({
      where: { dentistId },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    res.json(patients);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar pacientes.' });
  }
};
