import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

// retorna quantidade de não lidas
export async function getUnreadCount(req: Request, res: Response) {
  const { id: userId } = req.user!;

  const count = await prisma.notification.count({
    where: {
      userId,
      read: false,
    },
  });

  return res.json({ unread: count });
}

// marca todas como lidas
export async function markAllAsRead(req: Request, res: Response) {
  const { id: userId } = req.user!;

  await prisma.notification.updateMany({
    where: {
      userId,
      read: false,
    },
    data: {
      read: true,
    },
  });

  return res.status(204).send();
}
