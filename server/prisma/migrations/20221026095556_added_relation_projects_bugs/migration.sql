/*
  Warnings:

  - The primary key for the `Project` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `prjoect_id` on the `Project` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Project" DROP CONSTRAINT "Project_pkey",
DROP COLUMN "prjoect_id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Project_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "Bugs" ADD CONSTRAINT "Bugs_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
