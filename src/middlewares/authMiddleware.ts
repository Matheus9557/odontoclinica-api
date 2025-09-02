import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'segredo123';

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Token ausente' });

  const [, token] = authHeader.split(' ');
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = {
      id: decoded.id,
      role: decoded.role,
    };
    next();
  } catch {
    return res.status(401).json({ error: 'Token inválido' });
  }
}

export function onlyDentist(req: Request, res: Response, next: NextFunction) {
  if (req.user?.role !== 'dentist') {
    return res.status(403).json({ error: 'Acesso permitido apenas para dentistas' });
  }
  next();
}

export function onlyPatient(req: Request, res: Response, next: NextFunction) {
  if (req.user?.role !== 'patient') {
    return res.status(403).json({ error: 'Acesso permitido apenas para pacientes' });
  }
  next();
}
