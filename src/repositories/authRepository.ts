import { prisma } from "../lib/prisma";

export class AuthRepository {
  async findDentistByEmail(email: string) {
    return prisma.dentist.findUnique({
      where: { email },
    });
  }

  async findPatientByEmail(email: string) {
    return prisma.patient.findUnique({
      where: { email },
    });
  }

  async findDentistById(id: string) {
    return prisma.dentist.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        cro: true,
        avatar: true,
      },
    });
  }

  async findPatientById(id: string) {
    return prisma.patient.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        dentistId: true,
        avatar: true,
      },
    });
  }

  async createDentist(data: {
    name: string;
    email: string;
    password: string;
    cro: string;
  }) {
    return prisma.dentist.create({
      data,
    });
  }

  async createPatient(data: {
    name: string;
    email: string;
    password: string;
    dentistId: string;
  }) {
    return prisma.patient.create({
      data,
    });
  }

  async dentistExists(id: string) {
    return prisma.dentist.findUnique({
      where: { id },
    });
  }
}