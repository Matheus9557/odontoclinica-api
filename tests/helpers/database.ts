import { prisma } from "../../src/lib/prisma";

export async function cleanDatabase() {
  await prisma.notification.deleteMany();

  await prisma.message.deleteMany();

  await prisma.painScaleEntry.deleteMany();

  await prisma.evaluation.deleteMany();

  await prisma.patient.deleteMany();

  await prisma.dentist.deleteMany();
}