import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";
import { MessageService } from "../services/messageService";

const messageService = new MessageService();

export const sendMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { content, receiverId } = req.body;

    const { id, role } = req.user!;

    const message = await messageService.sendMessage({
      senderId: id,
      role,
      receiverId,
      content,
    });

    return res.status(201).json(message);

  } catch (error) {
    next(error);
  }
};

export const getMessages = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id, role } = req.user!;

    const { patientId } = req.query;

    if (!patientId) {
      throw new AppError(
        "patientId obrigatório.",
        400
      );
    }

    const messages =
      await messageService.getMessages({
        userId: id,
        role,
        patientId: String(patientId),
      });

    return res.json(messages);

  } catch (error) {
    next(error);
  }
};