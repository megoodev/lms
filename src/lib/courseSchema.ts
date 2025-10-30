import { z } from "zod";
const levelCourse = ["Beginner", "Intermeduate", "Advanced"] as const;
const statusCourse = ["Draft", "Published", "Archived"] as const;
const CourseCategories = [
  "Devolepment",
  "Business",
  "Finance",
  "It & Softwere",
  "Office Producivity",
  "Design",
  "Markting",
  "Music",
  "Health & Fitness",
  "Teaching & Academics",
] as const;

const courseSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters long" })
    .max(100, { message: "Title must be at most 100 characters long" }),
  description: z
    .string()
    .min(3, { message: "Description must be at least 3 characters long" })
    .max(600, { message: "Description must be most 600 characters long" }),
  smallDescription: z
    .string()
    .min(3, { message: "Small description must be at least 3 characters" })
    .max(200, { message: "Description must be most 200 characters long" }),
  fileKey: z.string().min(1, { message: "File is required" }),
  slug: z.string().min(1, { message: "Slug is required" }),
  price: z.coerce
    .number()
    .min(1, { message: "Price must be a positive number" }),
  duration: z.coerce
    .number()
    .min(1, { message: "Duration must be at least 1 hour" })
    .max(500, { message: "Duration must be at most 500 hour" }),
  category: z.enum(CourseCategories, { message: "Category is required" }),
  level: z.enum(levelCourse, { message: "Level is required" }),
  status: z.enum(statusCourse, { message: "Status is required" }),
});

type CourseSChemaType = z.infer<typeof courseSchema>;

export {
  type CourseSChemaType,
  courseSchema,
  CourseCategories,
  levelCourse,
  statusCourse,
};
