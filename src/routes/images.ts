import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import { upload } from '../utils/multer';
import { authenticate, onlyPatient } from '../middlewares/authMiddleware';

const router = Router();

// Schema MongoDB
const ImageSchema = new mongoose.Schema({
  patientId: String,
  evaluationId: String,
  filename: String,
  path: String,
  uploadedAt: { type: Date, default: Date.now },
});

const ImageModel = mongoose.model('Image', ImageSchema);

// Upload de imagem
router.post('/:patientId/:evaluationId', authenticate, onlyPatient, upload.single('image'), async (req: Request, res: Response) => {
  try {
    const { patientId, evaluationId } = req.params;
    const file = req.file;

    if (!file) return res.status(400).json({ error: 'Arquivo não enviado.' });

    const saved = await ImageModel.create({
      patientId,
      evaluationId,
      filename: file.filename,
      path: file.path,
    });

    res.json(saved);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao fazer upload da imagem.' });
  }
});

// Listar imagens de uma avaliação
router.get('/:evaluationId', authenticate, async (req: Request, res: Response) => {
  const { evaluationId } = req.params;
  const images = await ImageModel.find({ evaluationId }).sort({ uploadedAt: -1 });
  res.json(images);
});

// Listar imagens de um paciente
router.get('/patient/:patientId', authenticate, async (req: Request, res: Response) => {
  const { patientId } = req.params;
  const images = await ImageModel.find({ patientId }).sort({ uploadedAt: -1 });
  res.json(images);
});

export default router;
