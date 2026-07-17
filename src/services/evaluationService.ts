import { EvaluationRepository } from "../repositories/evaluationRepository";

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
      throw new Error("Paciente não encontrado.");
    }

    if (patient.dentistId !== dentistId) {
      throw new Error("Paciente não pertence a este dentista.");
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
      throw new Error("Paciente não encontrado.");
    }

    if (patient.dentistId !== dentistId) {
      throw new Error("Paciente não pertence a este dentista.");
    }

    return this.repository.findAllByPatient(patientId);
  }
}