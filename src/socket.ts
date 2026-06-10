import { Server } from "socket.io";

let io: Server;

export function initSocket(server: any) {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("🟢 Usuário conectado:", socket.id);

    // registra usuário na sala com seu userId
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

// 🔔 função usada nos controllers
export function notifyUser(userId: string, payload: any) {
  if (!io) return;

  io.to(userId).emit("notification:new_message", payload);
}
