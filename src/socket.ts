import http from "http";
import { Server, Socket } from "socket.io";

import { env } from "./config/env";
import { verifyToken, JwtPayload } from "./config/jwt";
import { logger } from "./lib/logger";

let io: Server | null = null;

interface AuthenticatedSocket extends Socket {
  data: {
    user: JwtPayload;
  };
}

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

  io.use((socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ??
        socket.handshake.headers.authorization?.replace("Bearer ", "");

      if (!token) {
        return next(new Error("Token não informado."));
      }

      const user = verifyToken(token);

      (socket as AuthenticatedSocket).data.user = user;

      next();
    } catch {
      next(new Error("Token inválido."));
    }
  });

  io.on("connection", (socket) => {
    const authSocket = socket as AuthenticatedSocket;

    const user = authSocket.data.user;

    authSocket.join(user.id);

    logger.info(
      {
        socketId: socket.id,
        userId: user.id,
        role: user.role,
      },
      "Cliente conectado ao Socket.IO"
    );

    authSocket.on(
      "conversation:join",
      (conversationId: string) => {
        authSocket.join(conversationId);

        logger.info(
          {
            socketId: socket.id,
            conversationId,
          },
          "Usuário entrou em uma conversa"
        );
      }
    );

    authSocket.on(
      "conversation:leave",
      (conversationId: string) => {
        authSocket.leave(conversationId);

        logger.info(
          {
            socketId: socket.id,
            conversationId,
          },
          "Usuário saiu da conversa"
        );
      }
    );

    authSocket.on("disconnect", () => {
      logger.info(
        {
          socketId: socket.id,
          userId: user.id,
        },
        "Cliente desconectado"
      );
    });
  });

  return io;
}

export function emitNotification(
  userId: string,
  payload: unknown
): void {
  if (!io) return;

  io.to(userId).emit(
    "notification:new",
    payload
  );
}

export function emitConversationMessage(
  conversationId: string,
  payload: unknown
): void {
  if (!io) return;

  io.to(conversationId).emit(
    "message:new",
    payload
  );
}

export function getIO(): Server {
  if (!io) {
    throw new Error(
      "Socket.IO ainda não foi inicializado."
    );
  }

  return io;
}