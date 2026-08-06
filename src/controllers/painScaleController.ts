import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";
import { PainScaleService } from "../services/painScaleService";
import { getRequestUser } from "../utils/requestUser";

export class PainScaleController {

  constructor(
    private readonly painScaleService: PainScaleService
  ) {}



  createDailyPainEntry = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {

    try {


      const user =
        getRequestUser(req);



      const file =
        req.file;



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






      const entry =
        await this.painScaleService.createDailyEntry({

          patientId:
            user.id,

          scale:
            Number(scale),

          comments,

          evaluationId,

          file,

        });






      return res
        .status(201)
        .json(entry);





    } catch (error) {

      next(error);

    }

  };







  getPatientPainHistory = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {


    try {


      const user =
        getRequestUser(req);




      const {

        patientId,

      } = req.params;






      const entries =
        await this.painScaleService.getPatientHistory({

          dentistId:
            user.id,

          patientId,

        });







      return res.json(entries);




    } catch (error) {

      next(error);

    }

  };

}