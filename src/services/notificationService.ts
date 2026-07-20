import { AppError } from "../errors/AppError";

import {
  NotificationRepository,
} from "../repositories/notificationRepository";


export class NotificationService {


  private readonly repository =
    new NotificationRepository();



  async getUnreadCount(userId: string) {

    if (!userId) {

      throw new AppError(
        "Usuário não informado.",
          400
            );
    }


    const count =
      await this.repository.countUnread(
        userId
      );


    return {
      unread: count,
    };

  }





  async markAllAsRead(userId: string) {


    if (!userId) {

      throw new AppError(
        "Usuário não informado.",
          400
            );

    }


    await this.repository.markAllAsRead(
      userId
    );


    return;

  }





  async getNotifications(userId: string) {


    if (!userId) {

      throw new AppError(
        "Usuário não informado.",
          400
            );

    }


    return this.repository.findAll(
      userId
    );

  }

}