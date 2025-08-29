import { Router } from 'express';
import { upload } from '../utils/multer';

const router = Router();

router.post('/', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Nenhum arquivo enviado' });
  }
  res.json({ filename: req.file.filename, path: req.file.path });
});

export default router;
