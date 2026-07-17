import { prisma } from "../lib/prisma";
import { Prisma } from "@prisma/client";

export class PatientRepository {

  async findByEmail(email: string) {
    return prisma.patient.findUnique({
      where: {
        email,
      },
    });
  }

  async findById(id: string) {
    return prisma.patient.findUnique({
      where: {
        id,
      },
    });
  }

  async create(data: {
    name: string;
    email: string;
    password: string;
    dentistId: string;
  }) {
    return prisma.patient.create({
      data,
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
      },
    });
  }

  async findAllByDentist(dentistId: string) {
    return prisma.patient.findMany({
      where: {
        dentistId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
      },
    });
  }

  async update(
  patientId: string,
  data: Prisma.PatientUpdateInput
) {
    return prisma.patient.update({
      where: {
        id: patientId,
      },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
      },
    });
  }

  async delete(patientId: string) {
    return prisma.patient.delete({
      where: {
        id: patientId,
      },
    });
  }

  async findProfile(id: string) {
    return prisma.patient.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        dentistId: true,
        avatar: true,
      },
    });
  }

}