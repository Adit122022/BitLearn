import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import CurriculumManagerClient from "@/app/admin/courses/[courseId]/modules/_components/CurriculumManagerClient";

export default async function UniversityCourseModulesPage({ params }: { params: Promise<{ courseId: string }> }) {
    const p = await params;
    const course = await prisma.course.findUnique({
        where: { id: p.courseId },
        include: {
            modules: {
                orderBy: { order: "asc" },
                include: {
                    lessons: {
                        orderBy: { order: "asc" }
                    }
                }
            }
        }
    });

    if (!course) notFound();

    return (
        <div className="flex flex-col gap-6 p-4 lg:p-6">
            <div className="flex items-center gap-4">
                <Link href="/university/courses" className={buttonVariants({ variant: "outline" })}>
                    <ArrowLeft className="size-4" />
                    Back
                </Link>
                <h1 className="text-2xl font-bold">Curriculum: {course.title}</h1>
            </div>

            <CurriculumManagerClient course={course} />
        </div>
    );
}
