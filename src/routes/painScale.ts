import { Router } from "express";
import {
  createDailyPainEntry,
  getPatientPainHistory,
} from "../controllers/painScaleController";
import { authenticate, onlyPatient, onlyDentist } from "../middlewares/authMiddleware";
import { upload } from "../utils/multer";

const router = Router();

// Paciente envia formulário
router.post(
  "/",
  authenticate,
  onlyPatient,
  upload.single("image"),
  createDailyPainEntry
);

// Dentista busca histórico do paciente
router.get(
  "/patient/:patientId",
  authenticate,
  onlyDentist,
  getPatientPainHistory
);

export default router;
