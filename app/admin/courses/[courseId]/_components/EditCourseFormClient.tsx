"use client";

import CourseForm from "@/components/forms/CourseForm";
import { updateCourse } from "@/app/actions/course-actions";
import { CourseSchemaType } from "@/lib/zodSchemas";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function EditCourseFormClient({ course }: { course: any }) {
    const router = useRouter();

    const defaultValues: CourseSchemaType = {
        title: course.title,
        description: course.description,
        fileKey: course.fileKey || "",
        price: course.price,
        duration: course.duration,
        level: course.level as any,
        category: course.category as any,
        smallDescription: course.smallDescription,
        slug: course.slug,
        status: course.status as any,
    };

    async function handleUpdate(data: CourseSchemaType) {
        await updateCourse(course.id, data);
        toast.success("Course updated successfully!");
        router.refresh();
    }

    return (
        <CourseForm 
            defaultValues={defaultValues} 
            onSubmitAction={handleUpdate} 
            submitButtonText="Save Changes" 
        />
    );
}
