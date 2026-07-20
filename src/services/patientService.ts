import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";

import { PatientRepository } from "../repositories/patientRepository";

import { AppError } from "../errors/AppError";

export class PatientService {
  private readonly repository = new PatientRepository();

  async createPatient(data: {
    dentistId: string;
    name: string;
    email: string;
    password: string;
  }) {
    const {
      dentistId,
      name,
      email,
      password,
    } = data;

    if (!name || !email || !password) {
      throw new AppError(
        "Nome, email e senha são obrigatórios.",
          400
             );
    }

    const exists = await this.repository.findByEmail(email);

    if (exists) {
      throw new AppError(
        "Paciente com este e-mail já existe.",
          409
              );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    return this.repository.create({
      dentistId,
      name,
      email,
      password: hashedPassword,
    });
  }

  async getPatientsByDentist(dentistId: string) {
    return this.repository.findAllByDentist(dentistId);
  }

  async updatePatient(data: {
    dentistId: string;
    patientId: string;
    name?: string;
    email?: string;
    password?: string;
  }) {
    const {
      dentistId,
      patientId,
      name,
      email,
      password,
    } = data;

    const patient =
      await this.repository.findById(patientId);

    if (!patient || patient.dentistId !== dentistId) {
      throw new AppError(
        "Acesso negado.",
          403
            );
    }

    const updateData: Prisma.PatientUpdateInput = {};

    if (name) {
      updateData.name = name;
    }

    if (email) {
      updateData.email = email;
    }

    if (password) {
      updateData.password =
        await bcrypt.hash(password, 10);
    }

    return this.repository.update(
      patientId,
      updateData
    );
  }

  async deletePatient(data: {
    dentistId: string;
    patientId: string;
  }) {
    const {
      dentistId,
      patientId,
    } = data;

    const patient =
      await this.repository.findById(patientId);

    if (!patient || patient.dentistId !== dentistId) {
      throw new AppError(
        "Acesso negado.",
          403
            );
    }

    await this.repository.delete(patientId);

    return {
      message: "Paciente excluído com sucesso.",
    };
  }

  async getMe(patientId: string) {
    const patient =
      await this.repository.findProfile(patientId);

    if (!patient) {
      throw new AppError(
        "Paciente não encontrado.",
          404
            );
    }

    return patient;
  }
}