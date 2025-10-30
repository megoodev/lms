import { buttonVariants } from "@/components/ui/button";
import { adminGetCourses } from "@/data/admin/admin-get-courses";
import Link from "next/link";
import AdminCardCourse from "./_components/admin-card-course";

const page = async() => {
  const data = await adminGetCourses();
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Your Course</h1>
        <Link className={buttonVariants()} href={"/admin/courses/create"}>
          Create Course
        </Link>
      </div>
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7 mt-5">
          {data.map((course) => (
            <AdminCardCourse key={course.id} data={course} />
            ))}
        </div>
      </div>
    </>
  );
};

export default page;
