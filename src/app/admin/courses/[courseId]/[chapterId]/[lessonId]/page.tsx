import { buttonVariants } from "@/components/ui/button";
import { adminGetLesson } from "@/data/admin/Admin-get-lesson";
import Link from "next/link";
import EditLessonForm from "./_components/EditLessonForm";
import { ArrowLeft } from "lucide-react";
interface EditLessonRouteProps {
  params: Promise<{
    courseId: string;
    chapterId: string;
    lessonId: string;
  }>;
}
const EditLessonRoute = async ({ params }: EditLessonRouteProps) => {
  const { lessonId, courseId, chapterId } = await params;
  const result = await adminGetLesson(lessonId);
  return (
    <div>
      <Link
        className={buttonVariants({ variant: "outline" })}
        href={`/admin/courses/${courseId}`}
      >
        <ArrowLeft />
        Back
      </Link>
      <EditLessonForm data={result} courseId={courseId} chapterId={chapterId} />
    </div>
  );
};

export default EditLessonRoute;
