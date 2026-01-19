import { Router } from "express";
import {
  signupDentist,
  signupPatient,
  login,
} from "../controllers/authController";

const router = Router();

console.log("🔥 Rotas de autenticação carregadas!");

// Cadastro
router.post("/signup/dentist", signupDentist);
router.post("/signup/patient", signupPatient);

// Login
router.post("/login", login);

export default router;
