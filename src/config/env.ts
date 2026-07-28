import dotenv from "dotenv";

dotenv.config();

function required(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Variável de ambiente obrigatória não encontrada: ${name}`);
  }

  return value;
}

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? "development",

  PORT: Number(process.env.PORT ?? 3000),

  DATABASE_URL: required("DATABASE_URL"),

  JWT_SECRET: required("JWT_SECRET"),

  FRONTEND_URL: process.env.FRONTEND_URL ?? "http://localhost:5173",

  API_URL: process.env.API_URL ?? "",

  CLOUDINARY_CLOUD_NAME:
  required("CLOUDINARY_CLOUD_NAME"),

  CLOUDINARY_API_KEY:
  required("CLOUDINARY_API_KEY"),

  CLOUDINARY_API_SECRET:
  required("CLOUDINARY_API_SECRET"),

  LOG_LEVEL: process.env.LOG_LEVEL ?? "info",

} as const;