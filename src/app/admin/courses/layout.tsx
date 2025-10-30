import { buttonVariants } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

const layoutCourse = ({children}: {children: ReactNode}) => {
  return (
    <div className="p-5">
      {children}
    </div>
  );
}

export default layoutCourse;