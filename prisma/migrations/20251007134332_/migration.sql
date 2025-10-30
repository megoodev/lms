/*
  Warnings:

  - Added the required column `fileKey` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Made the column `userId` on table `Course` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."Course" DROP CONSTRAINT "Course_userId_fkey";

-- AlterTable
ALTER TABLE "public"."Course" ADD COLUMN     "fileKey" TEXT NOT NULL,
ALTER COLUMN "userId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Course" ADD CONSTRAINT "Course_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
