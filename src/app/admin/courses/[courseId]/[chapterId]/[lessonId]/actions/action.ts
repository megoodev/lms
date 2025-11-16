'use server'

import { requireAdmin } from "@/data/admin/require-admin"
import prisma from "@/lib/db"
import { ApiResponse } from "@/lib/types"
import { lessonSchema, LessonSchemaType } from "@/lib/zodSchemas"
import { revalidatePath } from "next/cache"

export async function EditLesson(values: LessonSchemaType): Promise<ApiResponse> {
  await requireAdmin()
  try {
    const result = lessonSchema.safeParse(values)
    if (!result.success) {
      return {
        status: 'error',
        message: 'Invalid data'
      }
    }
    await prisma.lesson.update({
      where: {
        id:result.data.id
          
      },
      data: {
        title: result.data.name,
        videoKey: result.data.videoKey,
        thumbnilKey: result.data.thumbnilKey,
        description: result.data.description
      }
    })
    revalidatePath(`/admin/courses/${result.data.courseId}/${result.data.chapterId}/${result.data.id}`)
    return {
      status: 'success',
      message: 'Lesson edited successfully'
    }
  } catch {
    return {
      status: 'error',
      message: 'Failed to edit lesson'
    }
  }
}