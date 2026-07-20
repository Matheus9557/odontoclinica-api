import { Request, Response, NextFunction } from "express";
import { DentistService } from "../services/dentistService";

const dentistService = new DentistService();

export const getDentistProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const dentist = await dentistService.getProfile(req.user!.id);

    return res.json(dentist);
  } catch (error) {
    next(error);
  }
};

export const updateDentist = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const dentist = await dentistService.updateDentist({
      dentistId: req.user!.id,
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

export const deleteDentist = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await dentistService.deleteDentist(req.user!.id);

    return res.json(result);
  } catch (error) {
    next(error);
  }
};