import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "OdontoClínica API",
      version: "1.0.0",
      description:
        "API para gerenciamento de acompanhamento odontológico, avaliações, escala de dor, pacientes, dentistas e comunicação em tempo real.",
    },

    servers: [
      {
        url: "http://localhost:3000",
        description: "Servidor local",
      },
      {
        url: "https://odontoclinica-api.onrender.com",
        description: "Servidor produção",
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

export const swaggerSpec =
  swaggerJsdoc(options);