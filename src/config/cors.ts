import { CorsOptions } from "cors";
import { env } from "./env";

const allowedOrigins = [
  ...new Set([
    env.FRONTEND_URL,
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:4173",
  ]),
];

export const corsOptions: CorsOptions = {
  origin(origin, callback) {
    // Bruno, curl, Postman, Supertest...
    if (!origin) {
      return callback(null, true);
    }

    if (env.NODE_ENV === "test") {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    callback(new Error(`Origin '${origin}' não permitida pelo CORS.`));
  },

  credentials: true,

  methods: [
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
    "OPTIONS",
  ],

  allowedHeaders: [
    "Authorization",
    "Content-Type",
  ],

  exposedHeaders: [
    "Content-Length",
  ],

  optionsSuccessStatus: 204,
};