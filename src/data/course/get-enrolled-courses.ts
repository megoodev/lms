import prisma from "@/lib/db";
import {requireUser} from "../user/Require-user";

export async function getEnrolledCourses() {
  const user = await requireUser();
  const data = await prisma.enrollment.findMany({
    where: {
      userId: user.id,
      status: "Active",
    },
    select: {
      course: {
        select: {
          id: true,
          level: true,
          description: true,
          category: true,
          duration: true,
          fileKey: true,
          slug: true,
          title: true,
          price: true,
          chapters: {
            select: {
              title: true,
              lessons: {
                select: {
                  title: true,
                  thumbnilKey: true,
                  videoKey: true,
                  id: true,
                },
                orderBy: {
                  position: "desc",
                },
              },
            },
            orderBy: {
              position: "desc",
            },
          },
        },
      },
    },
  });
  return data;
}
