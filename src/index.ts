/// <reference path="./@types/express/index.d.ts" />

import dotenv from "dotenv";

dotenv.config();

import http from "http";
import app from "./app";
import { initSocket } from "./socket";
import { logger } from "./lib/logger";

const server = http.createServer(app);

const io = initSocket(server);

app.set("io", io);

async function startServer() {
  try {
    logger.info("Iniciando servidor...");
    const PORT = process.env.PORT ?? "3000";

    server.listen(Number(PORT), () => {
      logger.info(
  {
    port: PORT,
    environment: process.env.NODE_ENV ?? "development",
  },
  "Servidor iniciado"
);
    });

  } catch (err) {
    logger.fatal(
  { err },
  "Falha ao iniciar servidor"
    );
    process.exit(1);
  }
}

startServer();