import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";

let io: Server;

export function initSocket(server: HttpServer) {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  io.on("connection", (socket: Socket) => {
    console.log("🟢 Socket conectado:", socket.id);

    socket.on("register_user", (userId: string) => {
      socket.join(`user:${userId}`);
      console.log("👤 Usuário registrado no room:", userId);
    });

    socket.on("disconnect", () => {
      console.log("🔴 Socket desconectado:", socket.id);
    });
  });

  return io;
}

// 🔔 FUNÇÃO ÚNICA DE NOTIFICAÇÃO (PADRÃO DEFINITIVO)
export function notifyUser(userId: string, payload?: any) {
  if (!io) return;

  console.log("🔔 Enviando notificação para:", userId);

  io.to(`user:${userId}`).emit("notification:new_message", payload);
}
