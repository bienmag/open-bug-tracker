/*
  Warnings:

  - A unique constraint covering the columns `[message]` on the table `Bugs` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Bugs" ALTER COLUMN "solved_at" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Bugs_message_key" ON "Bugs"("message");
