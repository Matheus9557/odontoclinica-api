import { Request, Response } from 'express';
import ImageModel from '../models/Image';

export const uploadImage = async (req: Request, res: Response) => {
  try {
    const { patientId } = req.params;
    const file = req.file;

    if (!file) return res.status(400).json({ error: 'Arquivo não enviado.' });

    const saved = await ImageModel.create({
      patientId,
      evaluationId: req.body.evaluationId,
      filename: file.filename,
      path: file.path,
    });

    res.json(saved);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao fazer upload da imagem.' });
  }
};

export const getImagesByPatient = async (req: Request, res: Response) => {
  try {
    const { patientId } = req.params;
    const images = await ImageModel.find({ patientId }).sort({ uploadedAt: -1 });
    res.json(images);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar imagens do paciente.' });
  }
};
