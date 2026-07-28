import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";
import { PainScaleService } from "../services/painScaleService";
import { UploadService } from "../services/uploadService";


const painScaleService = new PainScaleService();

const uploadService = new UploadService();



export const createDailyPainEntry = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  try {

    const patientId = req.user?.id;


    if (!patientId) {
      throw new AppError(
        "Usuário não autenticado.",
        401
      );
    }


    const file = req.file;


    if (!file) {
      throw new AppError(
        "Imagem é obrigatória.",
        400
      );
    }


    if (!file.mimetype.startsWith("image/")) {
      throw new AppError(
        "Somente imagens são permitidas.",
        400
      );
    }


    const {
      scale,
      comments,
      evaluationId,
    } = req.body;


    if (!evaluationId) {
      throw new AppError(
        "Avaliação é obrigatória.",
        400
      );
    }


    /**
     * Upload da imagem para o Cloudinary
     */
    const imageUrl =
      await uploadService.uploadImage(
        file,
        "oralsync/pain-scale"
      );


    const entry =
      await painScaleService.createDailyEntry({

        patientId,

        scale: Number(scale),

        comments,

        imageUrl,

        evaluationId,

      });


    return res
      .status(201)
      .json(entry);


  } catch (error) {

    next(error);

  }

};





export const getPatientPainHistory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  try {

    const dentistId = req.user?.id;


    if (!dentistId) {
      throw new AppError(
        "Usuário não autenticado.",
        401
      );
    }


    const {
      patientId,
    } = req.params;


    const entries =
      await painScaleService.getPatientHistory({

        dentistId,

        patientId,

      });


    return res.json(entries);


  } catch (error) {

    next(error);

  }

};