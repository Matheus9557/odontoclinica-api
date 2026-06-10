import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

// Upload genérico (DailyForm, imagens clínicas, etc)
export const handleUpload = (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: "Nenhum arquivo enviado" });
  }

  res.json({
    filename: req.file.filename,
    path: req.file.path,
  });
};

// 🟢 UPLOAD DE AVATAR
export const uploadAvatar = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Não autenticado" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "Nenhum arquivo enviado" });
    }

    const { id, role } = req.user;
    const filename = req.file.filename;

    const publicUrl = `http://localhost:3000/uploads/${filename}`;

    if (role === "dentist") {
      await prisma.dentist.update({
        where: { id },
        data: { avatar: publicUrl },
      });
    } else {
      await prisma.patient.update({
        where: { id },
        data: { avatar: publicUrl },
      });
    }

    return res.json({
      avatarUrl: publicUrl,
    });
  } catch (error) {
    console.error("Erro no upload de avatar:", error);
    return res.status(500).json({ error: "Erro ao enviar avatar" });
  }
};
