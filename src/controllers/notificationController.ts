import {
  Request,
  Response,
} from "express";

import {
  NotificationService,
} from "../services/notificationService";


const service = new NotificationService();


// retorna quantidade de notificações não lidas
export async function getUnreadCount(
  req: Request,
  res: Response
) {

  try {

    const {
      id: userId,
    } = req.user!;


    const result =
      await service.getUnreadCount(
        userId
      );


    return res.json(result);


  } catch {

    return res.status(500).json({
      error: "Erro ao buscar notificações.",
    });

  }

}




// marca todas as notificações como lidas
export async function markAllAsRead(
  req: Request,
  res: Response
) {

  try {

    const {
      id: userId,
    } = req.user!;


    await service.markAllAsRead(
      userId
    );


    return res.status(204).send();


  } catch {

    return res.status(500).json({
      error: "Erro ao atualizar notificações.",
    });

  }

}