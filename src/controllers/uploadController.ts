import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { UploadService } from "../services/uploadService";


const uploadService = new UploadService();


// Upload genérico
export const handleUpload = (
  req: Request,
  res: Response
) => {

  if (!req.file) {
    return res.status(400).json({
      error: "Nenhum arquivo enviado",
    });
  }


  const url =
    uploadService.generatePublicUrl(
      req.file.filename
    );


  return res.json({
    filename: req.file.filename,
    url,
  });

};




// Upload Avatar

export const uploadAvatar = async (
  req: Request,
  res: Response
) => {

  try {

    if (!req.user) {
      return res.status(401).json({
        error: "Não autenticado",
      });
    }


    if (!req.file) {
      return res.status(400).json({
        error: "Nenhum arquivo enviado",
      });
    }


    const {
      id,
      role,
    } = req.user;


    const avatarUrl =
      uploadService.generatePublicUrl(
        req.file.filename
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

    console.error(
      "Erro upload avatar:",
      error
    );


    return res.status(500).json({
      error: "Erro interno",
    });

  }

};