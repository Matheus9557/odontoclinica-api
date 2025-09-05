import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'segredo123';

// Validação simples do CRO: 6 ou 7 dígitos + hífen + 2 letras maiúsculas
const isValidCRO = (cro: string) => /^[0-9]{6,7}-[A-Z]{2}$/.test(cro);

export const signupDentist = async (req: Request, res: Response) => {
  const { name, email, password, cro } = req.body;

  if (!isValidCRO(cro)) {
    return res.status(400).json({ error: 'CRO inválido. Formato esperado: 123456-SP ou 1234567-MG' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.dentist.create({
      data: { name, email, password: hashedPassword, cro },
    });

    res.status(201).json({ id: user.id, name: user.name, email: user.email, cro: user.cro });
  } catch (err) {
    res.status(400).json({ error: 'Erro ao cadastrar dentista' });
  }
};

export const signupPatient = async (req: Request, res: Response) => {
  const { name, email, password, dentistId } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.patient.create({
      data: { name, email, password: hashedPassword, dentistId },
    });
    res.status(201).json({ id: user.id, name: user.name, email: user.email, dentistId });
  } catch {
    res.status(400).json({ error: 'Erro ao cadastrar paciente' });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password, role } = req.body;
  if (!['dentist', 'patient'].includes(role)) return res.status(400).json({ error: 'Role inválido' });

  try {
    const user = role === 'dentist'
      ? await prisma.dentist.findUnique({ where: { email } })
      : await prisma.patient.findUnique({ where: { email } });

    if (!user || !bcrypt.compareSync(password, user.password)) return res.status(401).json({ error: 'Credenciais inválidas' });

    const token = jwt.sign({ id: user.id, role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token });
  } catch {
    res.status(500).json({ error: 'Erro no login' });
  }
};
