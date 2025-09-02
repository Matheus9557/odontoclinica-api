import { Router } from 'express';
import { upload } from '../utils/multer';
import { authenticate, onlyPatient } from '../middlewares/authMiddleware';

const router = Router();

// Todos os uploads precisam de autenticação
router.post('/', authenticate, onlyPatient, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Nenhum arquivo enviado' });
  }
  res.json({ filename: req.file.filename, path: req.file.path });
});

export default router;
