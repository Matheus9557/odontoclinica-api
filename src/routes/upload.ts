import { Router } from "express";
import { upload } from "../utils/multer";
import { authenticate } from "../middlewares/authMiddleware";
import { handleUpload, uploadAvatar } from "../controllers/uploadController";

const router = Router();

// 🔵 Upload genérico (DailyForm, imagens clínicas, etc)
router.post(
  "/",
  authenticate,
  upload.single("file"),   // 🔥 campo = "file"
  handleUpload
);

// 🟢 Upload de avatar
router.post(
  "/avatar",
  authenticate,
  upload.single("avatar"), // 🔥 campo = "avatar"
  uploadAvatar
);

export default router;
