import { prisma } from "../lib/prisma";


export class NotificationRepository {


  async countUnread(userId: string) {

    return prisma.notification.count({
      where: {
        userId,
        read: false,
      },
    });

  }



  async markAllAsRead(userId: string) {

    return prisma.notification.updateMany({

      where: {
        userId,
        read: false,
      },

      data: {
        read: true,
      },

    });

  }



  async findAll(userId: string) {

    return prisma.notification.findMany({

      where: {
        userId,
      },

      orderBy: {
        createdAt: "desc",
      },

    });

  }



  async create(data: {
    userId: string;
    type: "MESSAGE";
  }) {

    return prisma.notification.create({

      data: {

        userId: data.userId,

        type: data.type,

      },

    });

  }

}