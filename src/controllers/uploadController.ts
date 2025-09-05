import { Request, Response } from 'express';

export const handleUpload = (req: Request, res: Response) => {
  if (!req.file) return res.status(400).json({ error: 'Nenhum arquivo enviado' });
  res.json({ filename: req.file.filename, path: req.file.path });
};
