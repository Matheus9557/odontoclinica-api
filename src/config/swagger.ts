import swaggerJsdoc from "swagger-jsdoc";

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
        url: "https://odontoclinica-api.onrender.com",
        description: "Produção",
      },
      {
        url: "http://localhost:3000",
        description: "Desenvolvimento local",
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