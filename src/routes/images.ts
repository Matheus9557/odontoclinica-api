import { Router } from 'express';
import { upload } from '../utils/multer';
import { authenticate, onlyPatient } from '../middlewares/authMiddleware';
import { uploadImage, getImagesByPatient } from '../controllers/imageController';
import mongoose from 'mongoose';

const router = Router();

router.post('/:patientId', authenticate, onlyPatient, upload.single('image'), uploadImage);
router.get('/patient/:patientId', authenticate, getImagesByPatient);



// Esquema para MongoDB
const ImageSchema = new mongoose.Schema({
  patientId: String,
  evaluationId: String,
  filename: String,
  path: String,
  uploadedAt: { type: Date, default: Date.now },
});

const ImageModel = mongoose.model('Image', ImageSchema);

// Upload de imagem de avaliação (Paciente)
router.post(
  '/:patientId/:evaluationId',
  authenticate,
  onlyPatient,
  upload.single('image'),
  async (req, res) => {
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
  }
);

// Listar imagens de uma avaliação
router.get('/:evaluationId', authenticate, async (req, res) => {
  try {
    const { evaluationId } = req.params;
    const images = await ImageModel.find({ evaluationId }).sort({ uploadedAt: -1 });
    res.json(images);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar imagens.' });
  }
});

router.get('/patient/:patientId', authenticate, async (req, res) => {
  try {
    const { patientId } = req.params;
    const images = await ImageModel.find({ patientId }).sort({ uploadedAt: -1 });
    res.json(images);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar imagens do paciente.' });
  }
});


export default router;
