import { Request, Response, NextFunction } from "express";
import { PatientService } from "../services/patientService";

const patientService = new PatientService();

export const createPatient = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const patient = await patientService.createPatient({
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

export const getPatientsByDentist = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const patients = await patientService.getPatientsByDentist(
      req.user!.id
    );

    return res.json(patients);
  } catch (error) {
    next(error);
  }
};

export const updatePatient = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const patient = await patientService.updatePatient({
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

export const deletePatient = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await patientService.deletePatient({
      dentistId: req.user!.id,
      patientId: req.params.id,
    });

    return res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const patient = await patientService.getMe(req.user!.id);

    return res.json(patient);
  } catch (error) {
    next(error);
  }
};