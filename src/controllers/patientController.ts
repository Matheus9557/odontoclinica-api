import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Criar paciente vinculado ao dentista logado
export const createPatient = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const dentistId = req.user!.id; // dentista logado
    const hashedPassword = await bcrypt.hash(password, 10);

    const patient = await prisma.patient.create({
      data: { name, email, password: hashedPassword, dentistId },
    });

    res.status(201).json({ id: patient.id, name: patient.name, email: patient.email });
  } catch {
    res.status(500).json({ error: 'Erro ao criar paciente.' });
  }
};

// Listar pacientes do dentista logado
export const getPatientsByDentist = async (req: Request, res: Response) => {
  try {
    const dentistId = req.user!.id;
    const patients = await prisma.patient.findMany({
      where: { dentistId },
      select: { id: true, name: true, email: true },
    });
    res.json(patients);
  } catch {
    res.status(500).json({ error: 'Erro ao buscar pacientes.' });
  }
};

// Atualizar paciente do dentista logado
export const updatePatient = async (req: Request, res: Response) => {
  try {
    const dentistId = req.user!.id;
    const patientId = req.params.id;
    const { name, email, password } = req.body;

    // Garante que o paciente pertence ao dentista logado
    const patient = await prisma.patient.findUnique({ where: { id: patientId } });
    if (!patient || patient.dentistId !== dentistId) {
      return res.status(403).json({ error: 'Acesso negado.' });
    }

    const data: any = { name, email };
    if (password) data.password = await bcrypt.hash(password, 10);

    const updated = await prisma.patient.update({
      where: { id: patientId },
      data,
    });

    res.json(updated);
  } catch {
    res.status(500).json({ error: 'Erro ao atualizar paciente.' });
  }
};

// Excluir paciente do dentista logado
export const deletePatient = async (req: Request, res: Response) => {
  try {
    const dentistId = req.user!.id;
    const patientId = req.params.id;

    const patient = await prisma.patient.findUnique({ where: { id: patientId } });
    if (!patient || patient.dentistId !== dentistId) {
      return res.status(403).json({ error: 'Acesso negado.' });
    }

    await prisma.patient.delete({ where: { id: patientId } });

    res.json({ message: 'Paciente excluído.' });
  } catch {
    res.status(500).json({ error: 'Erro ao excluir paciente.' });
  }
};
