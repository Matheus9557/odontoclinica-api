/*
  Warnings:

  - Added the required column `dentistId` to the `PainScaleEntry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `patientId` to the `PainScaleEntry` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PainScaleEntry" DROP CONSTRAINT "PainScaleEntry_evaluationId_fkey";

-- AlterTable
ALTER TABLE "PainScaleEntry" ADD COLUMN     "comments" TEXT,
ADD COLUMN     "dentistId" TEXT NOT NULL,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "patientId" TEXT NOT NULL,
ALTER COLUMN "evaluationId" DROP NOT NULL,
ALTER COLUMN "date" SET DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE INDEX "PainScaleEntry_patientId_date_idx" ON "PainScaleEntry"("patientId", "date");

-- AddForeignKey
ALTER TABLE "PainScaleEntry" ADD CONSTRAINT "PainScaleEntry_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PainScaleEntry" ADD CONSTRAINT "PainScaleEntry_dentistId_fkey" FOREIGN KEY ("dentistId") REFERENCES "Dentist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PainScaleEntry" ADD CONSTRAINT "PainScaleEntry_evaluationId_fkey" FOREIGN KEY ("evaluationId") REFERENCES "Evaluation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
