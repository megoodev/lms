"use server";
import { requireAdmin } from "@/data/admin/require-admin";
import { courseSchema, CourseSChemaType } from "@/lib/courseSchema";
import prisma from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { revalidatePath } from "next/cache";
export async function EditCourse(
  data: CourseSChemaType,
  id: string
): Promise<ApiResponse> {
  await requireAdmin();
  try {
    const validation = courseSchema.safeParse(data);
    if (!validation.success) {
      return {
        status: "error",
        message: "data is not completed",
      };
    }
    await prisma.course.update({
      where: {
        id: id,
      },
      data: {
        ...validation.data,
      },
    });
    return {
      status: "success",
      message: "edit course successfully",
    };
  } catch (error) {
    return {
      status: "error",
      message: "Faield... edit course",
    };
  }
}
export async function ReordingChapters(
  courseId: string,
  chapters: { id: string; position: number }[]
): Promise<ApiResponse> {
  try {
    const updates = chapters.map((chapter) =>
      prisma.chapter.update({
        where: {
          courseId: courseId,
          id: chapter.id,
        },
        data: {
          position: chapter.position,
        },
      })
    );

    await prisma.$transaction(updates);
    revalidatePath(`admin/courses/${courseId}/edit`);
    return {
      status: "success",
      message: "reordring chapters successfully",
    };
  } catch {
    return {
      message: "Failed to reorder chapters",
      status: "error",
    };
  }
}
export async function reorderLessons(
  chapterId: string,
  lessons: { id: string; position: number }[],
  courseId: string
): Promise<ApiResponse> {
  try {
    if (!lessons || lessons.length === 0) {
      return {
        status: "error",
        message: "no lessons provided for reordring",
      };
    }
    const updates = lessons.map((lesson) =>
      prisma.lesson.update({
        where: {
          id: lesson.id,
          chapterId: chapterId,
        },
        data: {
          position: lesson.position,
        },
      })
    );
    await prisma.$transaction(updates);
    revalidatePath(`admin/courses/${courseId}/edit`);
    return {
      status: "success",
      message: "reordaring lessons successfully",
    };
  } catch {
    return {
      message: "failed to reorder lessons",
      status: "error",
    };
  }
}
