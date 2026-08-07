import { Request, Response, NextFunction } from "express";
import { NotificationService } from "../services/notificationService";

export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService
  ) {}

  getUnreadCount = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.user!;

      const result =
        await this.notificationService.getUnreadCount(id);

      return res.json(result);

    } catch (error) {
      next(error);
    }
  };


  getNotifications = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.user!;

      const notifications =
        await this.notificationService.getNotifications(id);

      return res.json(notifications);

    } catch (error) {
      next(error);
    }
  };


  markAllAsRead = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.user!;

      await this.notificationService.markAllAsRead(id);

      return res.status(204).send();

    } catch (error) {
      next(error);
    }
  };
}