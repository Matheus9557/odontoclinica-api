import http from "http";
import { Server as SocketIOServer } from "socket.io";
import { PrismaClient } from "@prisma/client";

import { logger } from "./logger";


let isShuttingDown = false;


export function setupGracefulShutdown(
  server: http.Server,
  io: SocketIOServer,
  prisma: PrismaClient
) {

  async function shutdown(signal: string) {

    if (isShuttingDown) {
      return;
    }

    isShuttingDown = true;


    logger.info(
      { signal },
      "Iniciando encerramento gracioso da aplicação"
    );


    try {

      await new Promise<void>((resolve) => {

        server.close(() => {

          logger.info(
            "Servidor HTTP encerrado"
          );

          resolve();

        });

      });


      await new Promise<void>((resolve) => {

  io.close(() => {

    logger.info(
      "Socket.IO encerrado"
    );

    resolve();

  });

});


      await prisma.$disconnect();


      logger.info(
        "Conexão com banco encerrada"
      );


      logger.info(
        "Aplicação finalizada corretamente"
      );


      process.exit(0);


    } catch (error) {

      logger.error(
        { error },
        "Erro durante encerramento da aplicação"
      );


      process.exit(1);

    }

  }


  process.on(
    "SIGTERM",
    () => shutdown("SIGTERM")
  );


  process.on(
    "SIGINT",
    () => shutdown("SIGINT")
  );

}