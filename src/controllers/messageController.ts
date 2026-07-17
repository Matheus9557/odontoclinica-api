import { Request, Response } from "express";

import {
  MessageService,
} from "../services/messageService";



const messageService =
  new MessageService();





export const sendMessage = async (
  req: Request,
  res: Response
) => {


  try {


    const {
      content,
      receiverId,
    } = req.body;



    const {
      id,
      role,
    } = req.user!;




    const message =
      await messageService.sendMessage({

        senderId: id,

        role,

        receiverId,

        content,

      });



    return res
      .status(201)
      .json(message);



  } catch (error) {


    console.error(
      "sendMessage error:",
      error
    );



    if (error instanceof Error) {


      if (
        error.message.includes(
          "não pertence"
        )
      ) {

        return res.status(403)
          .json({
            error:
              error.message,
          });

      }



      return res.status(400)
        .json({
          error:
            error.message,
        });


    }



    return res.status(500)
      .json({
        error:
          "Erro ao enviar mensagem.",
      });


  }


};








export const getMessages = async (
  req: Request,
  res: Response
) => {


  try {


    const {
      id,
      role,
    } =
      req.user!;



    const {
      patientId,
    } =
      req.query;




    if (!patientId) {

      return res.status(400)
        .json({
          error:
            "patientId obrigatório.",
        });

    }




    const messages =
      await messageService.getMessages({

        userId: id,

        role,

        patientId:
          String(patientId),

      });




    return res.json(messages);



  } catch(error) {


    console.error(
      "getMessages error:",
      error
    );



    if (error instanceof Error) {


      if (
        error.message.includes(
          "não pertence"
        )
      ) {

        return res
          .status(403)
          .json({
            error:
              error.message,
          });

      }



      return res
        .status(400)
        .json({
          error:
            error.message,
        });


    }



    return res
      .status(500)
      .json({
        error:
          "Erro ao buscar mensagens.",
      });


  }


};