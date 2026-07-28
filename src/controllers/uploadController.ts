import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";
import { UploadService } from "../services/uploadService";
import { AppError } from "../errors/AppError";


const uploadService = new UploadService();


export const handleUpload = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  try {

    if (!req.file) {
      throw new AppError(
        "Nenhum arquivo enviado",
        400
      );
    }


    const url =
      await uploadService.uploadImage(
        req.file,
        "oralsync/uploads"
      );


    return res.json({
      url,
    });


  } catch (error) {

    next(error);

  }

};



export const uploadAvatar = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  try {

    if (!req.user) {
      throw new AppError(
        "Não autenticado",
        401
      );
    }


    if (!req.file) {
      throw new AppError(
        "Nenhum arquivo enviado",
        400
      );
    }


    const {
      id,
      role,
    } = req.user;



    const avatarUrl =
      await uploadService.uploadImage(
        req.file,
        "oralsync/avatars"
      );



    if (role === "dentist") {

      await prisma.dentist.update({

        where: {
          id,
        },

        data: {
          avatar: avatarUrl,
        },

      });


    } else {

      await prisma.patient.update({

        where: {
          id,
        },

        data: {
          avatar: avatarUrl,
        },

      });

    }



    return res.json({

      avatarUrl,

    });



  } catch (error) {

    next(error);

  }

};