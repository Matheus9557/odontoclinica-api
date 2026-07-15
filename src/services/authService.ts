import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { AuthRepository } from "../repositories/authRepository";
import { isValidCro } from "../validators/croValidator";
import { JWT_SECRET } from "../config/jwt";
import { UserRole } from "../types/auth";

export class AuthService {
  private repository = new AuthRepository();

  async signupDentist(data: {
    name: string;
    email: string;
    password: string;
    cro: string;
  }) {
    const { name, email, password, cro } = data;

    if (!isValidCro(cro)) {
      throw new Error("CRO inválido.");
    }

    const exists = await this.repository.findDentistByEmail(email);

    if (exists) {
      throw new Error("E-mail já cadastrado.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const dentist = await this.repository.createDentist({
      name,
      email,
      password: hashedPassword,
      cro,
    });

    return {
      message: "Dentista cadastrado com sucesso!",
      user: {
        id: dentist.id,
        name: dentist.name,
        email: dentist.email,
        cro: dentist.cro,
        avatar: dentist.avatar,
      },
    };
  }


  async signupPatient(data: {
    name: string;
    email: string;
    password: string;
    dentistId: string;
  }) {
    const {
      name,
      email,
      password,
      dentistId,
    } = data;


    const exists =
      await this.repository.findPatientByEmail(email);

    if (exists) {
      throw new Error("E-mail já cadastrado.");
    }


    const dentistExists =
      await this.repository.dentistExists(dentistId);

    if (!dentistExists) {
      throw new Error("Dentista não encontrado.");
    }


    const hashedPassword =
      await bcrypt.hash(password, 10);


    const patient =
      await this.repository.createPatient({
        name,
        email,
        password: hashedPassword,
        dentistId,
      });


    return {
      message: "Paciente cadastrado com sucesso!",
      user: {
        id: patient.id,
        name: patient.name,
        email: patient.email,
        dentistId: patient.dentistId,
        avatar: patient.avatar,
      },
    };
  }


  async login(
  email: string,
  password: string,
  role: UserRole
) {

    if (
      role !== "dentist" &&
      role !== "patient"
    ) {
      throw new Error("Role inválido.");
    }


    const user =
      role === "dentist"
        ? await this.repository.findDentistByEmail(email)
        : await this.repository.findPatientByEmail(email);


    if (!user) {
      throw new Error("Credenciais inválidas.");
    }


    const validPassword =
      await bcrypt.compare(
        password,
        user.password
      );


    if (!validPassword) {
      throw new Error("Credenciais inválidas.");
    }


    const token = jwt.sign(
      {
        id: user.id,
        role,
      },
      JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );


    return {
      token,
      role,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    };
  }


  async me(
  id: string,
  role: UserRole
     ) {

    const user =
      role === "dentist"
        ? await this.repository.findDentistById(id)
        : await this.repository.findPatientById(id);


    if (!user) {
      throw new Error("Usuário não encontrado.");
    }


    return {
      ...user,
      role,
    };
  }
}