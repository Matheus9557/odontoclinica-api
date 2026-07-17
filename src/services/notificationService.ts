import {
  NotificationRepository,
} from "../repositories/notificationRepository";


export class NotificationService {


  private readonly repository =
    new NotificationRepository();



  async getUnreadCount(userId: string) {

    if (!userId) {

      throw new Error(
        "Usuário não informado."
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

      throw new Error(
        "Usuário não informado."
      );

    }


    await this.repository.markAllAsRead(
      userId
    );


    return;

  }





  async getNotifications(userId: string) {


    if (!userId) {

      throw new Error(
        "Usuário não informado."
      );

    }


    return this.repository.findAll(
      userId
    );

  }

}