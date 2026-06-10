/// <reference path="./@types/express/index.d.ts" />

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import http from "http";

import { initSocket } from "./socket";

// Rotas
import authRoutes from "./routes/auth";
import dentistRoutes from "./routes/dentist";
import patientRoutes from "./routes/patient";
import evaluationRoutes from "./routes/evaluation";
import imagesRoutes from "./routes/images";
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
   ROTAS
======================= */

app.use("/auth", authRoutes);
app.use("/dentists", dentistRoutes);
app.use("/patients", patientRoutes);
app.use("/evaluations", evaluationRoutes);
app.use("/images", imagesRoutes);
app.use("/upload", uploadRoutes);
app.use("/messages", messageRoutes);
app.use("/pain-scale", painScaleRoutes);
app.use("/notifications", notificationRoutes);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* =======================
   HTTP + SOCKET
======================= */

const server = http.createServer(app);

// Socket.IO
const io = initSocket(server);

// Disponibiliza io globalmente
app.set("io", io);

/* =======================
   START SERVER
======================= */

async function startServer() {
  try {
    console.log("⏳ Iniciando servidor...");

    const PORT = process.env.PORT ?? "3000";

    server.listen(Number(PORT), () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
    });

  } catch (err) {
    console.error("❌ Falha ao iniciar servidor:", err);
    process.exit(1);
  }
}

startServer();

/* =======================
   TESTE
======================= */

app.get("/", (_req, res) => {
  res.send("🚀 API Odontoclínica funcionando!");
});