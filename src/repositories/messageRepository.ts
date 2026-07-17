import { prisma } from "../lib/prisma";
import { SenderType } from "@prisma/client";


export class MessageRepository {


  async findPatientById(patientId: string) {

    return prisma.patient.findUnique({
      where: {
        id: patientId,
      },
    });

  }



  async createMessage(data: {
    content: string;
    senderType: SenderType;
    dentistId: string;
    patientId: string;
  }) {


    return prisma.message.create({

      data: {

        content: data.content,

        senderType: data.senderType,

        dentistId: data.dentistId,

        patientId: data.patientId,

        expiresAt:
          new Date(
            Date.now() +
            24 * 60 * 60 * 1000
          ),

      },

    });


  }




  async createNotification(
    userId: string
  ) {


    return prisma.notification.create({

      data: {

        userId,

        type: "MESSAGE",

      },

    });


  }




  async findMessages(
    dentistId: string,
    patientId: string
  ) {


    return prisma.message.findMany({

      where: {

        dentistId,

        patientId,

      },

      orderBy: {

        createdAt: "asc",

      },

    });


  }


}