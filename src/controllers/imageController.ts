import { Request, Response } from 'express';
import ImageModel from '../models/mongo/Image';

// Upload de imagem
export const uploadImage = async (req: Request, res: Response) => {
  try {
    const { patientId, evaluationId } = req.params;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'Arquivo não enviado.' });
    }

    const saved = await ImageModel.create({
      patientId,
      evaluationId,
      filename: file.filename,
      path: file.path,
      uploadedAt: new Date(),
    });

    return res.json(saved);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao fazer upload da imagem.' });
  }
};

// Listar imagens por avaliação
export const getImagesByEvaluation = async (req: Request, res: Response) => {
  try {
    const { evaluationId } = req.params;
    const images = await ImageModel.find({ evaluationId }).sort({ uploadedAt: -1 });

    return res.json(images);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao buscar imagens.' });
  }
};

// Listar imagens por paciente
export const getImagesByPatient = async (req: Request, res: Response) => {
  try {
    const { patientId } = req.params;
    const images = await ImageModel.find({ patientId }).sort({ uploadedAt: -1 });

    return res.json(images);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao buscar imagens do paciente.' });
  }
};
