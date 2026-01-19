import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "segredo123";

/* ---------------------- VALIDAR CRO ---------------------- */
const isValidCRO = (cro: string) => /^[0-9]{6,7}-[A-Z]{2}$/.test(cro);

/* ---------------------- SIGNUP DENTISTA ---------------------- */
export const signupDentist = async (req: Request, res: Response) => {
  const { name, email, password, cro } = req.body;

  if (!isValidCRO(cro)) {
    return res.status(400).json({
      error: "CRO inválido. Formato esperado: 123456-SP ou 1234567-MG",
    });
  }

  try {
    const exists = await prisma.dentist.findUnique({ where: { email } });
    if (exists) return res.status(400).json({ error: "E-mail já cadastrado" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.dentist.create({
      data: { name, email, password: hashed, cro },
    });

    return res.status(201).json({
      message: "Dentista cadastrado com sucesso!",
      user: { id: user.id, name: user.name, email: user.email, cro: user.cro },
    });
  } catch (err) {
    return res.status(500).json({ error: "Erro ao cadastrar dentista" });
  }
};

/* ---------------------- SIGNUP PACIENTE ---------------------- */
export const signupPatient = async (req: Request, res: Response) => {
  const { name, email, password, dentistId } = req.body;

  try {
    const exists = await prisma.patient.findUnique({ where: { email } });
    if (exists)
      return res.status(400).json({ error: "E-mail já cadastrado" });

    const dentistExists = await prisma.dentist.findUnique({
      where: { id: dentistId },
    });

    if (!dentistExists)
      return res.status(400).json({ error: "Dentista não encontrado" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.patient.create({
      data: { name, email, password: hashed, dentistId },
    });

    return res.status(201).json({
      message: "Paciente cadastrado com sucesso!",
      user: { id: user.id, name: user.name, email: user.email, dentistId },
    });
  } catch (err) {
    return res.status(500).json({ error: "Erro ao cadastrar paciente" });
  }
};

/* ---------------------- LOGIN ---------------------- */
export const login = async (req: Request, res: Response) => {
  const { email, password, role } = req.body;

  if (!["dentist", "patient"].includes(role)) {
    return res.status(400).json({ error: "Role inválido" });
  }

  try {
    const user =
      role === "dentist"
        ? await prisma.dentist.findUnique({ where: { email } })
        : await prisma.patient.findUnique({ where: { email } });

    if (!user) return res.status(401).json({ error: "Credenciais inválidas" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: "Credenciais inválidas" });

    // gerar token
    const token = jwt.sign(
      { id: user.id, role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      token,
      role,
      user: { id: user.id, name: user.name, email: user.email, role },
    });
  } catch (err) {
    return res.status(500).json({ error: "Erro no login" });
  }
};
