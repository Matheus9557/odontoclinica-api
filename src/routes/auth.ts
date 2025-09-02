import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'segredo123';

// -------------------------------
// ✅ Cadastro de Dentista
// -------------------------------
router.post('/signup/dentist', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const hashed = bcrypt.hashSync(password, 10);
    const user = await prisma.dentist.create({
      data: { name, email, password: hashed },
    });

    // Retorno sem a senha
    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  } catch (err) {
    res.status(400).json({ error: 'Erro ao cadastrar dentista' });
  }
});

// -------------------------------
// ✅ Cadastro de Paciente
// -------------------------------
router.post('/signup/patient', async (req, res) => {
  const { name, email, password, dentistId } = req.body;

  try {
    const hashed = bcrypt.hashSync(password, 10);
    const user = await prisma.patient.create({
      data: { name, email, password: hashed, dentistId },
    });

    // Retorno sem a senha
    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      dentistId: user.dentistId,
    });
  } catch (err) {
    res.status(400).json({ error: 'Erro ao cadastrar paciente' });
  }
});

// -------------------------------
// ✅ Login para Dentista ou Paciente
// -------------------------------
router.post('/login', async (req, res) => {
  const { email, password, role } = req.body;

  if (!['dentist', 'patient'].includes(role)) {
    return res.status(400).json({ error: 'Role inválido' });
  }

  try {
    let user: any;

    if (role === 'dentist') {
      user = await prisma.dentist.findUnique({ where: { email } });
    } else {
      user = await prisma.patient.findUnique({ where: { email } });
    }

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const token = jwt.sign(
      { id: user.id, role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Erro no login' });
  }
});

export default router;
