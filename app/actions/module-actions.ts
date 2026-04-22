"use server"

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { z } from "zod";
import { revalidatePath } from "next/cache";

async function getTeacherSession() {
    const session = await auth.api.getSession({
        headers: await headers()
    });
    const userRole = (session?.user as any)?.role;
    if (!session || (userRole !== "TEACHER" && userRole !== "ADMIN")) {
        throw new Error("Unauthorized");
    }
    return session;
}

// Ensure the user owns the course this module belongs to
async function verifyCourseOwnership(courseId: string, userId: string, role: string) {
    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course || (course.userId !== userId && role !== "ADMIN")) {
        throw new Error("Unauthorized");
    }
    return course;
}

const moduleSchema = z.object({
    title: z.string().min(1),
    isPublic: z.boolean().default(false),
});

export async function createModule(courseId: string, data: { title: string; isPublic: boolean; }) {
    const session = await getTeacherSession();
    await verifyCourseOwnership(courseId, session.user.id, (session.user as any).role);
    
    // get max order
    const maxOrderModule = await prisma.module.findFirst({
        where: { courseId },
        orderBy: { order: "desc" }
    });
    const newOrder = maxOrderModule ? maxOrderModule.order + 1 : 1;

    const result = await prisma.module.create({
        data: {
            courseId,
            title: data.title,
            isPublic: data.isPublic,
            order: newOrder
        }
    });

    revalidatePath(`/admin/courses/${courseId}/modules`);
    revalidatePath(`/courses`);

    return result;
}

export async function updateModule(moduleId: string, data: { title?: string; isPublic?: boolean; order?: number }) {
    const session = await getTeacherSession();
    const mod = await prisma.module.findUnique({ where: { id: moduleId }});
    if (!mod) throw new Error("Not found");
    
    await verifyCourseOwnership(mod.courseId, session.user.id, (session.user as any).role);

    const result = await prisma.module.update({
        where: { id: moduleId },
        data
    });

    revalidatePath(`/admin/courses/${mod.courseId}/modules`);

    return result;
}

export async function deleteModule(moduleId: string) {
    const session = await getTeacherSession();
    const mod = await prisma.module.findUnique({ where: { id: moduleId }});
    if (!mod) throw new Error("Not found");
    
    await verifyCourseOwnership(mod.courseId, session.user.id, (session.user as any).role);

    const result = await prisma.module.delete({ where: { id: moduleId } });

    revalidatePath(`/admin/courses/${mod.courseId}/modules`);

    return result;
}

export async function createLesson(moduleId: string, data: { title: string; videoKey?: string; duration?: number }) {
    const session = await getTeacherSession();
    const mod = await prisma.module.findUnique({ where: { id: moduleId }});
    if (!mod) throw new Error("Not found");
    
    await verifyCourseOwnership(mod.courseId, session.user.id, (session.user as any).role);

    const maxOrderLesson = await prisma.lesson.findFirst({
        where: { moduleId },
        orderBy: { order: "desc" }
    });
    const newOrder = maxOrderLesson ? maxOrderLesson.order + 1 : 1;

    const result = await prisma.lesson.create({
        data: {
            moduleId,
            title: data.title,
            videoKey: data.videoKey,
            duration: data.duration || 0,
            order: newOrder
        }
    });

    revalidatePath(`/admin/courses/${mod.courseId}/modules`);

    return result;
}

export async function updateLesson(lessonId: string, data: { title?: string; videoKey?: string; duration?: number; order?: number }) {
    const session = await getTeacherSession();
    const lesson = await prisma.lesson.findUnique({ where: { id: lessonId }, include: { module: true }});
    if (!lesson) throw new Error("Not found");
    
    await verifyCourseOwnership(lesson.module.courseId, session.user.id, (session.user as any).role);

    const result = await prisma.lesson.update({
        where: { id: lessonId },
        data
    });

    revalidatePath(`/admin/courses/${lesson.module.courseId}/modules`);

    return result;
}

export async function deleteLesson(lessonId: string) {
    const session = await getTeacherSession();
    const lesson = await prisma.lesson.findUnique({ where: { id: lessonId }, include: { module: true }});
    if (!lesson) throw new Error("Not found");
    
    await verifyCourseOwnership(lesson.module.courseId, session.user.id, (session.user as any).role);

    const result = await prisma.lesson.delete({ where: { id: lessonId } });

    revalidatePath(`/admin/courses/${lesson.module.courseId}/modules`);

    return result;
}
