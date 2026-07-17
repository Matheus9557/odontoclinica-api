import { prisma } from "../lib/prisma";

export class EvaluationRepository {
  async findPatientById(patientId: string) {
    return prisma.patient.findUnique({
      where: {
        id: patientId,
      },
      select: {
        id: true,
        dentistId: true,
      },
    });
  }

  async create(data: {
    patientId: string;
    startDate: Date;
    endDate: Date;
  }) {
    return prisma.evaluation.create({
      data,
    });
  }

  async findAllByPatient(patientId: string) {
    return prisma.evaluation.findMany({
      where: {
        patientId,
      },
      orderBy: {
        startDate: "desc",
      },
    });
  }
}