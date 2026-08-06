/// <reference path="./@types/express/index.d.ts" />

import { env } from "./config/env";

import http from "http";
import app from "./app";
import { initSocket } from "./socket";
import { logger } from "./lib/logger";
import { prisma } from "./lib/prisma";
import { setupGracefulShutdown } from "./lib/shutdown";


const server = http.createServer(app);


const io = initSocket(server);


app.set("io", io);



setupGracefulShutdown(
  server,
  io,
  prisma
);



async function startServer() {

  try {

    logger.info(
      "Iniciando servidor..."
    );


    


    server.listen(env.PORT, () => {

      logger.info(
        {
          port: env.PORT,
          environment: env.NODE_ENV,
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