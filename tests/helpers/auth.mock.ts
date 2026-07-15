export const hashedPassword =
  "$2a$10$abcdefghijklmnopqrstuv123456789012345678901234567890";

export const jwtMock = "fake-jwt-token";

export const dentistMock = {
  id: "dentist-123",
  name: "Dr. João Silva",
  email: "joao@email.com",
  password: hashedPassword,
  cro: "PB12345",
  avatar: null,
};

export const patientMock = {
  id: "patient-123",
  name: "Maria Souza",
  email: "maria@email.com",
  password: hashedPassword,
  dentistId: "dentist-123",
  avatar: null,
};

export const signupDentistDTO = {
  name: "Dr. João Silva",
  email: "joao@email.com",
  password: "123456",
  cro: "PB12345",
};

export const signupPatientDTO = {
  name: "Maria Souza",
  email: "maria@email.com",
  password: "123456",
  dentistId: "dentist-123",
};