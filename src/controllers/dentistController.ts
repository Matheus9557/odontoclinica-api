import { Request, Response, NextFunction } from "express";
import { DentistService } from "../services/dentistService";
import { getRequestUser } from "../utils/requestUser";

export class DentistController {
  constructor(
    private readonly dentistService: DentistService
  ) {}

  getDentistProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const dentist =
        await this.dentistService.getProfile(
          getRequestUser(req).id
        );

      return res.json(dentist);

    } catch (error) {
      next(error);
    }
  };

  updateDentist = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const dentist =
        await this.dentistService.updateDentist({
          dentistId: getRequestUser(req).id,
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
          cro: req.body.cro,
        });

      return res.json(dentist);

    } catch (error) {
      next(error);
    }
  };

  deleteDentist = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result =
        await this.dentistService.deleteDentist(
          getRequestUser(req).id
        );

      return res.json(result);

    } catch (error) {
      next(error);
    }
  };
}