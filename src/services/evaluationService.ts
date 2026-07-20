import { EvaluationRepository } from "../repositories/evaluationRepository";
import { AppError } from "../errors/AppError";

export class EvaluationService {
  private readonly repository = new EvaluationRepository();

  async createEvaluation(data: {
    dentistId: string;
    patientId: string;
  }) {
    const {
      dentistId,
      patientId,
    } = data;

    const patient =
      await this.repository.findPatientById(patientId);

    if (!patient) {
      throw new AppError(
        "Paciente não encontrado.",
          404
            );
    }

    if (patient.dentistId !== dentistId) {
      throw new AppError(
        "Paciente não pertence a este dentista.",
          403
          );
    }

    const startDate = new Date();

    const endDate = new Date();

    endDate.setDate(startDate.getDate() + 30);

    return this.repository.create({
      patientId,
      startDate,
      endDate,
    });
  }

  async getEvaluationsByPatient(data: {
    dentistId: string;
    patientId: string;
  }) {
    const {
      dentistId,
      patientId,
    } = data;

    const patient =
      await this.repository.findPatientById(patientId);

    if (!patient) {
      throw new AppError(
        "Paciente não encontrado.",
          404
            );
    }

    if (patient.dentistId !== dentistId) {
      throw new AppError(
        "Paciente não pertence a este dentista.",
          403
          );
    }

    return this.repository.findAllByPatient(patientId);
  }
}