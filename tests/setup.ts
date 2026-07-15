import dotenv from "dotenv";

dotenv.config({
  path: ".env.test",
});

import { cleanDatabase } from "./helpers/database";
import { prisma } from "../src/lib/prisma";


beforeEach(async () => {
  await cleanDatabase();
});


afterAll(async () => {
  await prisma.$disconnect();
});