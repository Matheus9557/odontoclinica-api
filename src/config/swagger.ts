import swaggerJsdoc from "swagger-jsdoc";
import { env } from "./env";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "OralSync API",
      version: "1.0.0",
      description:
        "API REST para gerenciamento de acompanhamento odontológico, avaliações, escala de dor, pacientes, dentistas, mensagens e notificações.",
      contact: {
        name: "Matheus Gomes",
        url: "https://github.com/Matheus9557",
      },
      license: {
        name: "MIT",
      },
    },

    servers: [
      {
        url: env.API_URL || "http://localhost:3000",
        description:
          env.NODE_ENV === "production"
            ? "Produção"
            : "Desenvolvimento",
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },

  apis: [
    "./src/routes/*.ts",
    "./src/controllers/*.ts",
  ],
};

export const swaggerSpec = swaggerJsdoc(options);