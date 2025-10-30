import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <section className="py-18">
        <div className="flex items-center flex-col gap-8 text-center">
          <Badge variant={'outline'}>The Future of Online eduction</Badge>
          <h1 className="text-6xl font-bold">Elevate your Learning Exprerience </h1>
          <p className="max-w-[570px] text-muted-foreground space-x-1.5">
            Discover a new way to learn with our modern, interactive learning
            management system. Access high-quality courses anytime, anywhere
          </p>
          <div className="flex gap-5">
            <Link href={'/courses'} className={buttonVariants({size: 'lg'})}>Explore Courses</Link>
            <Link href={'/login'} className={buttonVariants({variant: 'outline', size: 'lg'})}>Sign In</Link>
          </div>
        </div>
      </section>
      <section></section>
    </>
  );
}
