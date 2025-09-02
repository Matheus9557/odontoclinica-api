import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, onlyDentist } from '../middlewares/authMiddleware';

const router = Router();
const prisma = new PrismaClient();

// Dentista vê todos seus pacientes
router.get('/', authenticate, onlyDentist, async (req: Request, res: Response) => {
  try {
    const dentistId = req.user!.id; // Tipagem garantida pelo middleware

    const patients = await prisma.patient.findMany({
      where: { dentistId },
      select: { id: true, name: true, email: true },
    });

    res.json(patients);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar pacientes.' });
  }
});

export default router;
