import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";
import { UploadService } from "../services/uploadService";
import { AppError } from "../errors/AppError";

export class UploadController {
  constructor(
    private readonly uploadService: UploadService
  ) {}

  handleUpload = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.file) {
        throw new AppError("Nenhum arquivo enviado", 400);
      }

      const url = await this.uploadService.uploadImage(
        req.file,
        "oralsync/uploads"
      );

      return res.json({ url });

    } catch (error) {
      next(error);
    }
  };

  uploadAvatar = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {

      if (!req.user) {
        throw new AppError("Não autenticado", 401);
      }

      if (!req.file) {
        throw new AppError("Nenhum arquivo enviado", 400);
      }

      const avatarUrl =
        await this.uploadService.uploadImage(
          req.file,
          "oralsync/avatars"
        );

      if (req.user.role === "dentist") {

        await prisma.dentist.update({
          where: {
            id: req.user.id,
          },
          data: {
            avatar: avatarUrl,
          },
        });

      } else {

        await prisma.patient.update({
          where: {
            id: req.user.id,
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
}