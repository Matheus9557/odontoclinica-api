import { Request, Response, NextFunction } from "express";
import { NotificationService } from "../services/notificationService";

const service = new NotificationService();

export const getUnreadCount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.user!;

    const result = await service.getUnreadCount(id);

    return res.json(result);

  } catch (error) {
    next(error);
  }
};

export const markAllAsRead = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.user!;

    await service.markAllAsRead(id);

    return res.status(204).send();

  } catch (error) {
    next(error);
  }
};