import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";

import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";

// Rotas
import authRoutes from "./routes/auth";
import dentistRoutes from "./routes/dentist";
import patientRoutes from "./routes/patient";
import evaluationRoutes from "./routes/evaluation";
import uploadRoutes from "./routes/upload";
import messageRoutes from "./routes/messages";
import painScaleRoutes from "./routes/painScale";
import notificationRoutes from "./routes/notification";

dotenv.config();

const app = express();

/* =======================
   MIDDLEWARES
======================= */

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =======================
   SWAGGER DOCUMENTATION
======================= */

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);

/* =======================
   ROTAS
======================= */

app.use("/auth", authRoutes);
app.use("/dentists", dentistRoutes);
app.use("/patients", patientRoutes);
app.use("/evaluations", evaluationRoutes);
app.use("/upload", uploadRoutes);
app.use("/messages", messageRoutes);
app.use("/pain-scale", painScaleRoutes);
app.use("/notifications", notificationRoutes);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* =======================
   HEALTH CHECK
======================= */

app.get("/", (_req, res) => {
  res.send("🚀 API Odontoclínica funcionando!");
});

export default app;