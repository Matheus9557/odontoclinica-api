import { prisma } from "../lib/prisma";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";

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

    if (!dentist) {
      return res.status(404).json({ error: "Dentista não encontrado." });
    }

    return res.json(dentist);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao buscar perfil do dentista." });
  }
};

export const updateDentist = async (req: Request, res: Response) => {
  try {
    const dentistId = req.user!.id;
    const { name, email, password, cro } = req.body;

    const existing = await prisma.dentist.findUnique({ where: { id: dentistId } });
    if (!existing) {
      return res.status(404).json({ error: "Dentista não encontrado." });
    }

    const data: any = {
      name: name ?? existing.name,
      email: email ?? existing.email,
      cro: cro ?? existing.cro,
    };

    if (password) {
      data.password = await bcrypt.hash(password, 10);
    }

    const updated = await prisma.dentist.update({
      where: { id: dentistId },
      data,
      select: { id: true, name: true, email: true, cro: true },
    });

    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao atualizar dentista." });
  }
};

export const deleteDentist = async (req: Request, res: Response) => {
  try {
    const dentistId = req.user!.id;

    const existing = await prisma.dentist.findUnique({ where: { id: dentistId } });
    if (!existing) {
      return res.status(404).json({ error: "Dentista não encontrado." });
    }

    await prisma.patient.deleteMany({ where: { dentistId } });
    await prisma.dentist.delete({ where: { id: dentistId } });

    return res.json({ message: "Dentista e pacientes associados foram excluídos." });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao excluir dentista." });
  }
};
