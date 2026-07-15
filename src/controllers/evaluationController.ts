import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const createEvaluation = async (
  req: Request,
  res: Response
) => {

  const { patientId } = req.params;
  const dentistId = req.user!.id;

  try {

    const patient = await prisma.patient.findUnique({
      where: {
        id: patientId,
      },
    });


    if (!patient) {
      return res.status(404).json({
        error: "Paciente não encontrado.",
      });
    }


    if (patient.dentistId !== dentistId) {
      return res.status(403).json({
        error: "Paciente não pertence a este dentista.",
      });
    }


    const startDate = new Date();

    const endDate = new Date();

    endDate.setDate(
      startDate.getDate() + 30
    );


    const evaluation =
      await prisma.evaluation.create({
        data: {
          patientId,
          startDate,
          endDate,
        },
      });


    return res.status(201).json(evaluation);


  } catch (error) {

    console.error(
      "createEvaluation error:",
      error
    );

    return res.status(500).json({
      error: "Erro ao criar avaliação.",
    });

  }
};



export const getEvaluationsByPatient = async (
  req: Request,
  res: Response
) => {

  const { patientId } = req.params;

  try {

    const evaluations =
      await prisma.evaluation.findMany({

        where: {
          patientId,
        },

        orderBy: {
          startDate: "desc",
        },

      });


    return res.json(evaluations);


  } catch (error) {

    console.error(
      "getEvaluationsByPatient error:",
      error
    );

    return res.status(500).json({
      error: "Erro ao buscar avaliações.",
    });

  }
};