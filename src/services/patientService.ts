import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";

import { PatientRepository } from "../repositories/patientRepository";

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
      throw new Error("Nome, email e senha são obrigatórios.");
    }

    const exists = await this.repository.findByEmail(email);

    if (exists) {
      throw new Error("Paciente com este e-mail já existe.");
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
      throw new Error("Acesso negado.");
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
      throw new Error("Acesso negado.");
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
      throw new Error("Paciente não encontrado.");
    }

    return patient;
  }
}