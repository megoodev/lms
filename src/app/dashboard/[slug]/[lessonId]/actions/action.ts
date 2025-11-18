"use server";

import { requireAdmin } from "@/data/admin/require-admin";
import { requireUser } from "@/data/user/Require-user";
import arcjet, { fixedWindow } from "@/lib/arcjet";
import prisma from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { request } from "@arcjet/next";
import { revalidatePath } from "next/cache";
const aj = arcjet.withRule(
  fixedWindow({
    mode: "LIVE",
    window: "1m",
    max: 5,
  })
);
export async function MarkLessonComplete(
  lessonId: string,
  slug: string
): Promise<ApiResponse> {
  const session = await requireAdmin();
  try {
    const req = await request();
    const decision = await aj.protect(req, {
      fingerPrint: session.user.id,
    });
    if (decision.isDenied()) {
      return {
        status: "error",
        message: "You have been blocked",
      };
    }
    await prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId: session.user.id,
          lessonId: lessonId,
        },
      },
      update: {
        completed: true,
      },
      create: {
        lessonId: lessonId,
        completed: true,
        userId: session.user.id,
      },
    });
    revalidatePath(`/dashboard/${slug}`);
    return {
      status: "success",
      message: "Progress updated",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to mark lesson",
    };
  }
}
