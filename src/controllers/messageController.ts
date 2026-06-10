import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { notifyUser } from "../socket";

// 📥 BUSCAR MENSAGENS
export const getMessages = async (req: Request, res: Response) => {
  const { id: userId, role } = req.user!;
  const { patientId } = req.query;

  try {
    let dentistId: string;

    if (role === "dentist") {
      dentistId = userId;
    } else {
      const patient = await prisma.patient.findUnique({
        where: { id: userId },
      });

      if (!patient) {
        return res.status(403).json({ error: "Paciente inválido" });
      }

      dentistId = patient.dentistId;
    }

    const messages = await prisma.message.findMany({
      where: {
        dentistId,
        patientId: String(patientId),
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return res.json(messages);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao buscar mensagens" });
  }
};

// 📤 ENVIAR MENSAGEM + NOTIFICAÇÃO
export const sendMessage = async (req: Request, res: Response) => {
  const { content, receiverId } = req.body;
  const { id: senderId, role } = req.user!;

  try {
    let dentistId: string;
    let patientId: string;
    let notifyTargetId: string;

    if (role === "dentist") {
      dentistId = senderId;
      patientId = receiverId;
      notifyTargetId = receiverId;
    } else {
      const patient = await prisma.patient.findUnique({
        where: { id: senderId },
      });

      if (!patient) {
        return res.status(403).json({ error: "Paciente inválido" });
      }

      dentistId = patient.dentistId;
      patientId = senderId;
      notifyTargetId = dentistId;
    }

    const message = await prisma.message.create({
      data: {
        content,
        senderType: role,
        dentistId,
        patientId,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });

    // 🔔 SALVA NOTIFICAÇÃO NO BANCO (PERSISTENTE)
    await prisma.notification.create({
      data: {
        userId: notifyTargetId,
        type: "message",
      },
    });

    // 🔔 SOCKET TEMPO REAL
    notifyUser(notifyTargetId, { type: "message" });

    return res.status(201).json(message);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao enviar mensagem" });
  }
};
