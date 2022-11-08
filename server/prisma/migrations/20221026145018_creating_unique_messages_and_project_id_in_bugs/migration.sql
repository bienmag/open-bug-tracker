/*
  Warnings:

  - A unique constraint covering the columns `[project_id,message]` on the table `Bugs` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Bugs_message_key";

-- CreateIndex
CREATE UNIQUE INDEX "Bugs_project_id_message_key" ON "Bugs"("project_id", "message");
