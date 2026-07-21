import { prisma } from "../lib/prisma";
import { logger } from "../lib/logger";

export async function cleanupMessages() {
  const result = await prisma.message.deleteMany({
    where: {
      expiresAt: {
        lt: new Date(),
      },
    },
  });

  logger.info(
    {
      deletedMessages: result.count,
    },
    "Limpeza automática de mensagens expiradas executada"
  );
}