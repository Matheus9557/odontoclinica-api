import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";

// Criar paciente vinculado ao dentista logado
export const createPatient = async (req: Request, res: Response) => {
  try {
    const dentistId = req.user!.id;
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Nome, email e senha são obrigatórios." });
    }

    // Checar e-mail duplicado
    const exists = await prisma.patient.findUnique({ where: { email } });
    if (exists) {
      return res.status(409).json({ error: "Paciente com este e-mail já existe." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const patient = await prisma.patient.create({
      data: { name, email, password: hashedPassword, dentistId },
      select: { id: true, name: true, email: true },
    });

    return res.status(201).json(patient);
  } catch (error) {
    console.error("createPatient error:", error);
    return res.status(500).json({ error: "Erro ao criar paciente." });
  }
};

export const getPatientsByDentist = async (req: Request, res: Response) => {
  try {
    const dentistId = req.user!.id;

    const patients = await prisma.patient.findMany({
      where: { dentistId },
      select: { id: true, name: true, email: true },
    });

    return res.json(patients);
  } catch (error) {
    console.error("getPatientsByDentist error:", error);
    return res.status(500).json({ error: "Erro ao buscar pacientes." });
  }
};

export const updatePatient = async (req: Request, res: Response) => {
  try {
    const dentistId = req.user!.id;
    const patientId = req.params.id;
    const { name, email, password } = req.body;

    const patient = await prisma.patient.findUnique({ where: { id: patientId } });

    if (!patient || patient.dentistId !== dentistId) {
      return res.status(403).json({ error: "Acesso negado." });
    }

    const data: any = {};
    if (name) data.name = name;
    if (email) data.email = email;
    if (password) data.password = await bcrypt.hash(password, 10);

    const updated = await prisma.patient.update({
      where: { id: patientId },
      data,
      select: { id: true, name: true, email: true },
    });

    return res.json(updated);
  } catch (error) {
    console.error("updatePatient error:", error);
    return res.status(500).json({ error: "Erro ao atualizar paciente." });
  }
};

export const deletePatient = async (req: Request, res: Response) => {
  try {
    const dentistId = req.user!.id;
    const patientId = req.params.id;

    const patient = await prisma.patient.findUnique({ where: { id: patientId } });
    if (!patient || patient.dentistId !== dentistId) {
      return res.status(403).json({ error: "Acesso negado." });
    }

    await prisma.patient.delete({ where: { id: patientId } });

    return res.json({ message: "Paciente excluído com sucesso." });
  } catch (error) {
    console.error("deletePatient error:", error);
    return res.status(500).json({ error: "Erro ao excluir paciente." });
  }
};

// Retorna o paciente logado (usado para mensagens)
export const getMe = async (req: Request, res: Response) => {
  try {
    const patientId = req.user!.id;

    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
      select: {
        id: true,
        dentistId: true,
      },
    });

    if (!patient) {
      return res.status(404).json({ error: "Paciente não encontrado." });
    }

    return res.json(patient);
  } catch (error) {
    console.error("getMe error:", error);
    return res.status(500).json({ error: "Erro ao buscar paciente." });
  }
};
