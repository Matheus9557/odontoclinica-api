import { Request, Response, NextFunction } from "express";
import { PatientService } from "../services/patientService";

export class PatientController {
  constructor(
    private readonly patientService: PatientService
  ) {}

  createPatient = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const patient =
        await this.patientService.createPatient({
          dentistId: req.user!.id,
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
        });

      return res.status(201).json(patient);

    } catch (error) {
      next(error);
    }
  };

  getPatientsByDentist = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const patients =
        await this.patientService.getPatientsByDentist(
          req.user!.id
        );

      return res.json(patients);

    } catch (error) {
      next(error);
    }
  };

  updatePatient = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const patient =
        await this.patientService.updatePatient({
          dentistId: req.user!.id,
          patientId: req.params.id,
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
        });

      return res.json(patient);

    } catch (error) {
      next(error);
    }
  };

  deletePatient = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result =
        await this.patientService.deletePatient({
          dentistId: req.user!.id,
          patientId: req.params.id,
        });

      return res.json(result);

    } catch (error) {
      next(error);
    }
  };

  getMe = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const patient =
        await this.patientService.getMe(req.user!.id);

      return res.json(patient);

    } catch (error) {
      next(error);
    }
  };
}