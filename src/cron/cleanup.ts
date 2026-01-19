import { prisma } from "../lib/prisma";

export async function cleanupMessages() {
  await prisma.message.deleteMany({
    where: { expiresAt: { lt: new Date() } }
  });

  console.log("Mensagens expiradas removidas");
}
