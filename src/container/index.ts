/* -------------------------------------------------------------------------- */
/* Providers */
/* -------------------------------------------------------------------------- */

import { CloudinaryStorage } from "../providers/storage/CloudinaryStorage";

/* -------------------------------------------------------------------------- */
/* Repositories */
/* -------------------------------------------------------------------------- */

import { AuthRepository } from "../repositories/authRepository";
import { AvatarRepository } from "../repositories/avatarRepository";
import { DentistRepository } from "../repositories/dentistRepository";
import { EvaluationRepository } from "../repositories/evaluationRepository";
import { MessageRepository } from "../repositories/messageRepository";
import { NotificationRepository } from "../repositories/notificationRepository";
import { PatientRepository } from "../repositories/patientRepository";
import { PainScaleRepository } from "../repositories/painScaleRepository";

/* -------------------------------------------------------------------------- */
/* Services */
/* -------------------------------------------------------------------------- */

import { AvatarService } from "../services/avatarService";
import { AuthService } from "../services/authService";
import { DentistService } from "../services/dentistService";
import { EvaluationService } from "../services/evaluationService";
import { MessageService } from "../services/messageService";
import { NotificationService } from "../services/notificationService";
import { PatientService } from "../services/patientService";
import { PainScaleService } from "../services/painScaleService";
import { UploadService } from "../services/uploadService";

/* -------------------------------------------------------------------------- */
/* Controllers */
/* -------------------------------------------------------------------------- */

import { AuthController } from "../controllers/authController";
import { DentistController } from "../controllers/dentistController";
import { EvaluationController } from "../controllers/evaluationController";
import { MessageController } from "../controllers/messageController";
import { NotificationController } from "../controllers/notificationController";
import { PatientController } from "../controllers/patientController";
import { PainScaleController } from "../controllers/painScaleController";
import { UploadController } from "../controllers/uploadController";

/* -------------------------------------------------------------------------- */
/* Storage */
/* -------------------------------------------------------------------------- */

export const storage = new CloudinaryStorage();

/* -------------------------------------------------------------------------- */
/* Repositories */
/* -------------------------------------------------------------------------- */

export const authRepository = new AuthRepository();

export const avatarRepository = new AvatarRepository();

export const dentistRepository = new DentistRepository();

export const patientRepository = new PatientRepository();

export const evaluationRepository = new EvaluationRepository();

export const messageRepository = new MessageRepository();

export const notificationRepository = new NotificationRepository();

export const painScaleRepository = new PainScaleRepository();

/* -------------------------------------------------------------------------- */
/* Services */
/* -------------------------------------------------------------------------- */

export const uploadService = new UploadService(storage);

export const avatarService = new AvatarService(
  uploadService,
  avatarRepository
);

export const authService = new AuthService(
  authRepository
);

export const dentistService = new DentistService(
  dentistRepository
);

export const patientService = new PatientService(
  patientRepository
);

export const evaluationService = new EvaluationService(
  evaluationRepository
);

export const messageService = new MessageService(
  messageRepository,
  notificationRepository
);

export const notificationService = new NotificationService(
  notificationRepository
);

export const painScaleService = new PainScaleService(
  painScaleRepository,
  uploadService
);

/* -------------------------------------------------------------------------- */
/* Controllers */
/* -------------------------------------------------------------------------- */

export const authController = new AuthController(
  authService
);

export const dentistController = new DentistController(
  dentistService
);

export const patientController = new PatientController(
  patientService
);

export const evaluationController = new EvaluationController(
  evaluationService
);

export const messageController = new MessageController(
  messageService
);

export const notificationController = new NotificationController(
  notificationService
);

export const painScaleController =
  new PainScaleController(
    painScaleService
  );

export const uploadController = new UploadController(
  uploadService
);