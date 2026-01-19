import { Router } from 'express';
import { upload } from '../utils/multer';
import { authenticate, onlyPatient } from '../middlewares/authMiddleware';
import { handleUpload } from '../controllers/uploadController';

const router = Router();

router.post('/', authenticate, onlyPatient, upload.single('file'), handleUpload);

export default router;
