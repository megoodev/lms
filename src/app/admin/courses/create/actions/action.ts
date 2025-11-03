"use server";

import { courseSchema, CourseSChemaType } from "@/lib/zodSchemas";
import prisma from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import arcjet, { detectBot } from "@/lib/arcjet";
import { fixedWindow, request } from "@arcjet/next";
import { requireAdmin } from "@/data/admin/require-admin";

const aj = arcjet
  .withRule(
    detectBot({
      mode: "LIVE",
      allow: [],
    })
  )
  .withRule(
    fixedWindow({
      mode: "LIVE",
      window: "1m",
      max: 5,
    })
  );
export async function CreateCourse(
  values: CourseSChemaType
): Promise<ApiResponse> {
  try {
    const session = await requireAdmin();
    const req = await request();
    const decision = await aj.protect(req, {
      fingerPrint: session?.user.id,
    });
    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return {
          status: "error",
          message: "you have been blocked dur to rate limiting",
        };
      } else {
        return {
          status: "error",
          message: "you are bot! if this is mistake conact our support",
        };
      }
    }
    if (!session?.user?.id) {
      return {
        status: "error",
        message: "Unauthorized: Please log in",
      };
    }

    const Validation = courseSchema.safeParse(values);

    if (!Validation.success) {
      return {
        status: "error",
        message: "invalid form data",
      };
    }

    await prisma.course.create({
      data: {
        ...Validation.data,
        userId: session.user.id,
      },
    });

    return {
      status: "success",
      message: "course created successfully",
    };
  } catch {
    return {
      message: "internal server error",
      status: "error",
    };
  }
}
