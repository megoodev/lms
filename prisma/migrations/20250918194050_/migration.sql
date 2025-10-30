-- CreateEnum
CREATE TYPE "public"."StatusCourse" AS ENUM ('Draft', 'Published', 'Archived');

-- CreateEnum
CREATE TYPE "public"."CourseLevel" AS ENUM ('Beginner', 'Intermeduate', 'Advanced');

-- CreateTable
CREATE TABLE "public"."Course" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "smallDescription" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "duration" INTEGER NOT NULL,
    "slug" TEXT NOT NULL,
    "level" "public"."CourseLevel" NOT NULL DEFAULT 'Beginner',
    "status" "public"."StatusCourse" NOT NULL DEFAULT 'Draft',
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Course_slug_key" ON "public"."Course"("slug");

-- AddForeignKey
ALTER TABLE "public"."Course" ADD CONSTRAINT "Course_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
