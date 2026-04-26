import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import EditCourseFormClient from "@/app/admin/courses/[courseId]/_components/EditCourseFormClient";

export default async function UniversityEditCoursePage({ params }: { params: Promise<{ courseId: string }> }) {
    const p = await params;
    const course = await prisma.course.findUnique({
        where: { id: p.courseId }
    });

    if (!course) notFound();

    return (
        <div className="flex flex-col gap-6 p-4 lg:p-6">
             <div className="flex items-center gap-4">
                <Link href="/university/courses" className={buttonVariants({ variant: "outline" })}>
                    <ArrowLeft className="size-4" />
                    Back
                </Link>
                <h1 className="text-2xl font-bold">Edit Course: {course.title}</h1>
            </div>

            <div className="bg-card border shadow-sm rounded-lg p-6">
                <EditCourseFormClient course={course} />
            </div>
        </div>
    );
}
