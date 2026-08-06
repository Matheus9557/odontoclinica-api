import express from "express";
import cors from "cors";
import compression from "compression";
import helmet from "helmet";

import swaggerUi from "swagger-ui-express";
import pinoHttp from "pino-http";

import { swaggerSpec } from "./config/swagger";
import { corsOptions } from "./config/cors";

import { logger } from "./lib/logger";

// Middlewares
import { globalRateLimiter } from "./middlewares/rateLimiter";
import { errorHandler } from "./middlewares/errorHandler";

// Routes
import authRoutes from "./routes/auth";
import dentistRoutes from "./routes/dentist";
import patientRoutes from "./routes/patient";
import evaluationRoutes from "./routes/evaluation";
import uploadRoutes from "./routes/upload";
import messageRoutes from "./routes/messages";
import painScaleRoutes from "./routes/painScale";
import notificationRoutes from "./routes/notification";
import healthRoutes from "./routes/health";

const app = express();

/* =========================================================
 * LOGGING
 * ======================================================= */

app.use(
  pinoHttp({
    logger,
  })
);

/* =========================================================
 * SECURITY
 * ======================================================= */

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

app.use(compression());

app.use(globalRateLimiter);

/* =========================================================
 * MIDDLEWARES
 * ======================================================= */

app.use(cors(corsOptions));

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);



/* =========================================================
 * DOCUMENTATION
 * ======================================================= */

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);


/* =========================================================
 * ROUTES
 * ======================================================= */
app.use("/health", healthRoutes);
app.use("/auth", authRoutes);
app.use("/dentists", dentistRoutes);
app.use("/patients", patientRoutes);
app.use("/evaluations", evaluationRoutes);
app.use("/upload", uploadRoutes);
app.use("/messages", messageRoutes);
app.use("/pain-scale", painScaleRoutes);
app.use("/notifications", notificationRoutes);

/* =========================================================
 * HEALTH CHECK
 * ======================================================= */

app.get("/", (_req, res) => {
  logger.info("Health check realizado.");

  res.send("🚀 API Odontoclínica funcionando!");
});

/* =========================================================
 * ERROR HANDLER
 * ======================================================= */

app.use(errorHandler);

export default app;