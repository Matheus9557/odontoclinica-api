import { Request, Response } from "express";

import {
  DentistService,
} from "../services/dentistService";


const dentistService =
  new DentistService();





export const getDentistProfile = async (
  req: Request,
  res: Response
) => {


  try {


    const dentist =
      await dentistService.getProfile(
        req.user!.id
      );


    return res.json(
      dentist
    );


  } catch(error) {


    if(error instanceof Error) {


      if(
        error.message.includes(
          "não encontrado"
        )
      ){

        return res.status(404)
          .json({
            error:error.message,
          });

      }


    }



    return res.status(500)
      .json({
        error:
          "Erro ao buscar perfil do dentista.",
      });


  }


};








export const updateDentist = async (
  req: Request,
  res: Response
) => {


  try {


    const {
      name,
      email,
      password,
      cro,
    } = req.body;



    const dentist =
      await dentistService.updateDentist({

        dentistId:req.user!.id,

        name,

        email,

        password,

        cro,

      });



    return res.json(
      dentist
    );


  } catch(error) {


    if(error instanceof Error){


      if(
        error.message.includes(
          "não encontrado"
        )
      ){

        return res.status(404)
          .json({
            error:error.message,
          });

      }


    }


    return res.status(500)
      .json({
        error:
          "Erro ao atualizar dentista.",
      });


  }


};









export const deleteDentist = async (
  req: Request,
  res: Response
) => {


  try {


    const result =
      await dentistService.deleteDentist(
        req.user!.id
      );


    return res.json(
      result
    );


  } catch(error) {


    if(error instanceof Error){


      if(
        error.message.includes(
          "não encontrado"
        )
      ){

        return res.status(404)
          .json({
            error:error.message,
          });

      }


    }



    return res.status(500)
      .json({
        error:
          "Erro ao excluir dentista.",
      });


  }


};