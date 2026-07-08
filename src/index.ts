import http from "http";

import app from "./app";
import { initSocket } from "./socket";

const server = http.createServer(app);

const io = initSocket(server);

app.set("io", io);

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