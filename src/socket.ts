import http from "http";
import { Server, Socket } from "socket.io";
import { logger } from "./lib/logger";
import { env } from "./config/env";

let io: Server | null = null;

export function initSocket(server: http.Server): Server {
  io = new Server(server, {

  cors: {
    origin: env.FRONTEND_URL,
    credentials: true,
  },

  transports: [
    "websocket",
    "polling",
  ],

});

  io.on("connection", (socket: Socket) => {
    logger.info(
  { socketId: socket.id },
  "Cliente conectado ao Socket.IO"
);

    // Registra o usuário na sua sala privada
    socket.on("register_user", (userId: string) => {
      if (!userId) return;
      socket.join(userId);
      logger.info(
  {
    socketId: socket.id,
    userId,
  },
  "Usuário registrado para notificações"
);
    });

    socket.on("disconnect", () => {
      logger.info(
  { socketId: socket.id },
  "Cliente desconectado do Socket.IO"
);
    });
  });

  return io;
}

// Envia uma notificação para um usuário específico
export function notifyUser(
  userId: string,
  payload: Record<string, unknown>
): void {
  if (!io) {
    logger.warn(
  "Tentativa de envio de notificação antes da inicialização do Socket.IO"
);
    return;
  }

  io.to(userId).emit("notification:new_message", payload);
}

export function getIO(): Server {
  if (!io) {
    throw new Error("Socket.IO ainda não foi inicializado.");
  }

  return io;
}