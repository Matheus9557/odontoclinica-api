import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { AuthService } from "../../../src/services/authService";
import { AuthRepository } from "../../../src/repositories/authRepository";
import { isValidCro } from "../../../src/validators/croValidator";

import {
  dentistMock,
  patientMock,
  signupDentistDTO,
  signupPatientDTO,
  hashedPassword,
  jwtMock,
} from "../../helpers/auth.mock";

jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

jest.mock("../../../src/validators/croValidator", () => ({
  isValidCro: jest.fn(),
}));

describe("AuthService", () => {
  let authService: AuthService;
  let repository: jest.Mocked<AuthRepository>;

  beforeEach(() => {
    authService = new AuthService();

    repository = (authService as any)
      .repository as jest.Mocked<AuthRepository>;

    jest.spyOn(repository, "findDentistByEmail");
    jest.spyOn(repository, "findPatientByEmail");
    jest.spyOn(repository, "findDentistById");
    jest.spyOn(repository, "findPatientById");
    jest.spyOn(repository, "createDentist");
    jest.spyOn(repository, "createPatient");
    jest.spyOn(repository, "dentistExists");

    jest.clearAllMocks();
  });

  describe("signupDentist", () => {
    it("should create a dentist successfully", async () => {
      (isValidCro as jest.Mock).mockReturnValue(true);

      repository.findDentistByEmail.mockResolvedValue(null);

      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      repository.createDentist.mockResolvedValue({
        ...dentistMock,
        password: hashedPassword,
      });

      const result = await authService.signupDentist(signupDentistDTO);

      expect(result.message).toBe("Dentista cadastrado com sucesso!");
      expect(result.user.email).toBe(signupDentistDTO.email);
    });

    it("should throw if CRO is invalid", async () => {
      (isValidCro as jest.Mock).mockReturnValue(false);

      await expect(
        authService.signupDentist(signupDentistDTO)
      ).rejects.toThrow("CRO inválido.");
    });

    it("should throw if email already exists", async () => {
      (isValidCro as jest.Mock).mockReturnValue(true);

      repository.findDentistByEmail.mockResolvedValue({
        ...dentistMock,
        password: hashedPassword,
      });

      await expect(
        authService.signupDentist(signupDentistDTO)
      ).rejects.toThrow("E-mail já cadastrado.");
    });
  });

  describe("signupPatient", () => {
    it("should create a patient successfully", async () => {
      repository.findPatientByEmail.mockResolvedValue(null);

      repository.dentistExists.mockResolvedValue(dentistMock);

      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      repository.createPatient.mockResolvedValue({
        ...patientMock,
        password: hashedPassword,
      });

      const result = await authService.signupPatient(signupPatientDTO);

      expect(result.message).toBe("Paciente cadastrado com sucesso!");
      expect(result.user.email).toBe(signupPatientDTO.email);
    });

    it("should throw if dentist does not exist", async () => {
      repository.findPatientByEmail.mockResolvedValue(null);

      repository.dentistExists.mockResolvedValue(null);

      await expect(
        authService.signupPatient(signupPatientDTO)
      ).rejects.toThrow("Dentista não encontrado.");
    });

    it("should throw if patient email already exists", async () => {
      repository.findPatientByEmail.mockResolvedValue({
        ...patientMock,
        password: hashedPassword,
      });

      await expect(
        authService.signupPatient(signupPatientDTO)
      ).rejects.toThrow("E-mail já cadastrado.");
    });
  });

  describe("login", () => {
    it("should login successfully", async () => {
      repository.findDentistByEmail.mockResolvedValue({
        ...dentistMock,
        password: hashedPassword,
      });

      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      (jwt.sign as jest.Mock).mockReturnValue(jwtMock);

      const result = await authService.login(
        dentistMock.email,
        "123456",
        "dentist"
      );

      expect(result.token).toBe(jwtMock);
      expect(result.user.email).toBe(dentistMock.email);
    });

    it("should throw if password is incorrect", async () => {
      repository.findDentistByEmail.mockResolvedValue({
        ...dentistMock,
        password: hashedPassword,
      });

      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        authService.login(
          dentistMock.email,
          "senhaerrada",
          "dentist"
        )
      ).rejects.toThrow("Credenciais inválidas.");
    });

    it("should throw if user does not exist", async () => {
      repository.findDentistByEmail.mockResolvedValue(null);

      await expect(
        authService.login(
          dentistMock.email,
          "123456",
          "dentist"
        )
      ).rejects.toThrow("Credenciais inválidas.");
    });
  });

  describe("me", () => {
    it("should return dentist profile", async () => {
      repository.findDentistById.mockResolvedValue(dentistMock);

      const result = await authService.me(
        dentistMock.id,
        "dentist"
      );

      expect(result.id).toBe(dentistMock.id);
      expect(result.role).toBe("dentist");
    });

    it("should throw if user is not found", async () => {
      repository.findDentistById.mockResolvedValue(null);

      await expect(
        authService.me(
          dentistMock.id,
          "dentist"
        )
      ).rejects.toThrow("Usuário não encontrado.");
    });
  });
});