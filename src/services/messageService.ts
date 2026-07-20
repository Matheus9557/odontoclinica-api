import { AppError } from "../errors/AppError";

import {
  SenderType,
} from "@prisma/client";

import {
  MessageRepository,
} from "../repositories/messageRepository";


import {
  notifyUser,
} from "../socket";



export class MessageService {


  private readonly repository =
    new MessageRepository();



  async sendMessage(data: {

    senderId: string;

    role: "dentist" | "patient";

    receiverId: string;

    content: string;

  }) {


    const {
      senderId,
      role,
      receiverId,
      content,
    } = data;



    if (!content) {

      throw new AppError(
        "Mensagem não pode ser vazia.",
          400
            );

    }



    let dentistId: string;

    let patientId: string;

    let notifyTargetId: string;



    if (role === "dentist") {


      const patient =
        await this.repository.findPatientById(
          receiverId
        );



      if (!patient) {

        throw new AppError(
          "Paciente não encontrado.",
            404
              );

      }



      if (
        patient.dentistId !== senderId
      ) {

        throw new AppError(
          "Paciente não pertence a este dentista.",
            403
              );

      }



      dentistId = senderId;

      patientId = receiverId;

      notifyTargetId = receiverId;



    } else {



      const patient =
        await this.repository.findPatientById(
          senderId
        );



      if (!patient) {

        throw new AppError(
          "Paciente não encontrado.",
            404
              );

      }



      dentistId =
        patient.dentistId;


      patientId =
        senderId;


      notifyTargetId =
        dentistId;


    }




    const senderType =
      role === "dentist"
        ? SenderType.DENTIST
        : SenderType.PATIENT;




    const message =
      await this.repository.createMessage({

        content,

        senderType,

        dentistId,

        patientId,

      });





    await this.repository.createNotification(
      notifyTargetId
    );




    notifyUser(
      notifyTargetId,
      {
        type: "message",
      }
    );




    return message;


  }






  async getMessages(data: {

    userId: string;

    role: "dentist" | "patient";

    patientId: string;

  }) {



    const {
      userId,
      role,
      patientId,
    } = data;



    let dentistId: string;




    const patient =
      await this.repository.findPatientById(
        patientId
      );



    if (!patient) {

      throw new AppError(
          "Paciente não encontrado.",
            404
              );

    }




    if (role === "dentist") {


      if (
        patient.dentistId !== userId
      ) {

        throw new AppError(
          "Paciente não pertence a este dentista.",
            403
              );

      }



      dentistId = userId;



    } else {


      if (
        patient.id !== userId
      ) {

        throw new AppError(
          "Acesso negado.",
            403
              );

      }



      dentistId =
        patient.dentistId;


    }



    return this.repository.findMessages(
      dentistId,
      patientId
    );


  }


}