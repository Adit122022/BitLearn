"use client"

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CourseSchemaType } from "@/lib/zodSchemas";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { createCourse } from "@/app/actions/course-actions";
import { useRouter } from "next/navigation";
import CourseForm from "@/components/forms/CourseForm";

export default function CourseCreationPage() {
    const router = useRouter();

    const defaultValues: CourseSchemaType = {
        title: "",
        description: "",
        fileKey: "",
        price: 1,
        duration: 1,
        level: "Beginner",
        category: "Health & Fitness",
        smallDescription: "",
        slug: "",
        status: "Draft",
    };

    async function handleCreate(data: CourseSchemaType) {
        await createCourse(data);
        toast.success("Course created successfully!");
        router.push("/admin/courses");
        router.refresh();
    }

    return (
        <>
            <div className="flex items-center gap-4">
                <Link href="/admin/courses" className={buttonVariants({
                    variant: "outline",
                })}>
                    <ArrowLeft className="size-4" />
                    Back to Courses
                </Link>
                <h1 className="text-2xl font-bold">Create Course</h1>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>Provide basic information about course</CardDescription>
                </CardHeader>
                <CardContent>
                    <CourseForm 
                        defaultValues={defaultValues} 
                        onSubmitAction={handleCreate} 
                        submitButtonText="Create Course" 
                    />
                </CardContent>
            </Card>
        </>
    )
}