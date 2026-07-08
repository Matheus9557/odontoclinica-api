import http from "http";
import { Server, Socket } from "socket.io";

let io: Server;

export function initSocket(server: http.Server): Server {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      credentials: true,
    },
  });

  io.on("connection", (socket: Socket) => {
    console.log("🟢 Usuário conectado:", socket.id);

    // Registra o usuário na sua sala privada
    socket.on("register_user", (userId: string) => {
      socket.join(userId);
      console.log(`🔔 Usuário ${userId} registrado para notificações`);
    });

    socket.on("disconnect", () => {
      console.log("🔴 Usuário desconectado:", socket.id);
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
    console.warn("⚠️ Socket.IO ainda não foi inicializado.");
    return;
  }

  io.to(userId).emit("notification:new_message", payload);
}