import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

/**
 * POST /pain-scale
 * Paciente envia o relato diário (escala + comentário + imagem)
 */
export const createDailyPainEntry = async (req: Request, res: Response) => {
  try {
    console.log("📥 POST /pain-scale");

    const patientId = req.user?.id;
    const { scale, comments } = req.body;
    const file = req.file;

    if (!patientId) {
      return res.status(401).json({ error: "Usuário não autenticado." });
    }

    if (!file) {
      return res.status(400).json({ error: "Imagem é obrigatória." });
    }

    const scaleNumber = Number(scale);

    if (Number.isNaN(scaleNumber) || scaleNumber < 1 || scaleNumber > 10) {
      return res
        .status(400)
        .json({ error: "Escala deve ser entre 1 e 10." });
    }

    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
      select: { dentistId: true },
    });

    if (!patient) {
      return res.status(404).json({ error: "Paciente não encontrado." });
    }

    const imageUrl = `/uploads/${file.filename}`;

    const entry = await prisma.painScaleEntry.create({
      data: {
        scale: scaleNumber,
        comments,
        imageUrl,
        patientId,
        dentistId: patient.dentistId,
      },
    });

    console.log("✅ Relato diário criado:", entry.id);

    return res.status(201).json(entry);
  } catch (error) {
    console.error("🔥 Erro ao criar relato diário:", error);
    return res.status(500).json({
      error: "Erro ao registrar relato diário.",
    });
  }
};

/**
 * GET /pain-scale/patient/:patientId
 * Dentista busca histórico do paciente (para gráfico)
 */
export const getPatientPainHistory = async (
  req: Request,
  res: Response
) => {
  try {
    console.log("📥 GET /pain-scale/patient/:patientId");

    const { patientId } = req.params;

    const entries = await prisma.painScaleEntry.findMany({
      where: { patientId },
      orderBy: {
        date: "asc", // ✅ campo correto do schema
      },
    });

    console.log(`✅ ${entries.length} registros encontrados`);

    return res.json(entries);
  } catch (error) {
    console.error("🔥 Erro ao buscar histórico:", error);
    return res.status(500).json({
      error: "Erro ao buscar histórico do paciente.",
    });
  }
};
