import { Request, Response } from "express";

import { PainScaleService } from "../services/painScaleService";


const painScaleService =
  new PainScaleService();



/**
 * POST /pain-scale
 *
 * Paciente envia relato diário:
 * - escala de dor
 * - comentário
 * - imagem
 * - avaliação
 */
export const createDailyPainEntry = async (
  req: Request,
  res: Response
) => {

  try {

    const patientId = req.user?.id;

    const {
      scale,
      comments,
      evaluationId,
    } = req.body;


    const file = req.file;



    if (!patientId) {

      return res.status(401).json({
        error: "Usuário não autenticado.",
      });

    }



    if (!file) {

      return res.status(400).json({
        error: "Imagem é obrigatória.",
      });

    }



    if (!evaluationId) {

      return res.status(400).json({
        error: "Avaliação é obrigatória.",
      });

    }



    const entry =
      await painScaleService.createDailyEntry({

        patientId,

        scale: Number(scale),

        comments,

        imageUrl:
          `/uploads/${file.filename}`,

        evaluationId,

      });



    return res.status(201).json(entry);



  } catch (error: unknown) {


    console.error(
      "createDailyPainEntry error:",
      error
    );



    if (error instanceof Error) {

  const notFoundErrors = [
    "Paciente não encontrado.",
    "Avaliação não encontrada para este paciente.",
  ];


  const badRequestErrors = [
    "A avaliação não está ativa.",
    "Escala deve ser entre 1 e 10.",
  ];


  if (
    error.message ===
    "Paciente já enviou o relato diário."
  ) {

    return res.status(409).json({
      error: error.message,
    });

  }


  if (
    notFoundErrors.includes(error.message)
  ) {

    return res.status(404).json({
      error: error.message,
    });

  }


  if (
    badRequestErrors.includes(error.message)
  ) {

    return res.status(400).json({
      error: error.message,
    });

  }

}



    return res.status(500).json({
      error: "Erro ao registrar relato diário.",
    });


  }

};





/**
 * GET /pain-scale/patient/:patientId
 *
 * Dentista busca histórico do paciente
 */
export const getPatientPainHistory = async (
  req: Request,
  res: Response
) => {


  try {


    const dentistId =
      req.user?.id;



    const {
      patientId,
    } = req.params;




    if (!dentistId) {

      return res.status(401).json({
        error: "Usuário não autenticado.",
      });

    }




    const entries =
      await painScaleService.getPatientHistory({

        dentistId,

        patientId,

      });



    return res.json(entries);




  } catch (error: unknown) {


    console.error(
      "getPatientPainHistory error:",
      error
    );



    if (error instanceof Error) {


      switch (error.message) {


        case "Acesso negado.":

          return res.status(403).json({
            error: error.message,
          });



        case "Paciente não encontrado.":

          return res.status(404).json({
            error: error.message,
          });


      }

    }




    return res.status(500).json({
      error: "Erro ao buscar histórico do paciente.",
    });


  }

};