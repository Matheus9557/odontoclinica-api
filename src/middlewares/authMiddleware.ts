import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'segredo123';

// Extensão do Request para adicionar req.user
declare global {
  namespace Express {
    interface Request {
      user?: { id: string; role: 'dentist' | 'patient' };
    }
  }
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Token não fornecido' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; role: 'dentist' | 'patient' };
    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch {
    res.status(401).json({ error: 'Token inválido' });
  }
};

export const onlyDentist = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'dentist') {
    return res.status(403).json({ error: 'Acesso negado' });
  }
  next();
};

export const onlyPatient = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'patient') {
    return res.status(403).json({ error: 'Acesso negado' });
  }
  next();
};
