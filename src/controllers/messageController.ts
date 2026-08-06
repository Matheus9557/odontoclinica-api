import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";
import { MessageService } from "../services/messageService";
import { getRequestUser } from "../utils/requestUser";

export class MessageController {
  constructor(
    private readonly messageService: MessageService
  ) {}

  sendMessage = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const user = getRequestUser(req);

      const {
        content,
        receiverId,
      } = req.body;

      const message =
        await this.messageService.sendMessage({
          senderId: user.id,
          role: user.role,
          receiverId,
          content,
        });

      return res
        .status(201)
        .json(message);

    } catch (error) {
      next(error);
    }
  };


  getMessages = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const user = getRequestUser(req);

      const {
        patientId,
      } = req.query;

      if (!patientId) {
        throw new AppError(
          "patientId obrigatório.",
          400
        );
      }

      const messages =
        await this.messageService.getMessages({
          userId: user.id,
          role: user.role,
          patientId: String(patientId),
        });

      return res.json(messages);

    } catch (error) {
      next(error);
    }
  };
}