import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { getIO } from "../socket";
import { env } from "../config/env";
import { logger } from "../lib/logger";


async function checkDatabase(): Promise<boolean> {

  try {

    await prisma.$queryRaw`SELECT 1`;

    return true;

  } catch (error) {

    logger.error(
      { error },
      "Health check database falhou"
    );

    return false;
  }
}



function checkSocket(): boolean {

  const io = getIO();

  return Boolean(io);

}



export async function healthCheck(
  _req: Request,
  res: Response
) {

  const database = await checkDatabase();

  const socket = checkSocket();


  const status =
    database
      ? "UP"
      : "DOWN";


  return res.status(
    database ? 200 : 503
  ).json({

    status,

    environment: env.NODE_ENV,

    timestamp:
      new Date().toISOString(),

    uptime:
      process.uptime(),

    services: {

      database:
        database
          ? "UP"
          : "DOWN",

      socket:
        socket
          ? "UP"
          : "DOWN",

    },

  });

}



export function liveCheck(
  _req: Request,
  res: Response
) {

  return res.status(200).json({

    status: "UP",

    timestamp:
      new Date().toISOString(),

  });

}



export async function readyCheck(
  _req: Request,
  res: Response
) {

  const database =
    await checkDatabase();


  if (!database) {

    return res.status(503).json({

      status: "DOWN",

      database: "DOWN",

    });

  }


  return res.status(200).json({

    status: "UP",

    database: "UP",

  });

}