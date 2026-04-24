"use server"

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

async function getUserSession() {
    const session = await auth.api.getSession({
        headers: await headers()
    });
    if (!session) {
        throw new Error("Unauthorized");
    }
    return session;
}

export async function enrollInCourse(courseId: string) {
    const session = await getUserSession();
    
    // Check if already enrolled
    const existing = await prisma.enrollment.findUnique({
        where: {
            userId_courseId: {
                userId: session.user.id,
                courseId
            }
        }
    });

    if (existing) {
        return existing;
    }

    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) throw new Error("Course not found");

    // Mock payment/enrollment for now
    return prisma.enrollment.create({
        data: {
            userId: session.user.id,
            courseId,
            amount: course.price
        }
    });
}

export async function checkEnrollment(courseId: string) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return false;

    const existing = await prisma.enrollment.findUnique({
        where: {
            userId_courseId: {
                userId: session.user.id,
                courseId
            }
        }
    });

    return !!existing;
}

export async function getEnrolledCourses() {
    const session = await getUserSession();
    const userId = session.user.id;

    const enrollments = await prisma.enrollment.findMany({
        where: { userId },
        include: {
            course: {
                include: {
                    user: { select: { name: true, image: true } },
                    modules: { include: { lessons: { select: { id: true } } } },
                }
            }
        },
        orderBy: { createdAt: "desc" }
    });

    // Batch-fetch all lesson progress for this user
    const allLessonIds = enrollments.flatMap(e =>
        e.course.modules.flatMap(m => m.lessons.map(l => l.id))
    );

    const completedSet = new Set<string>();
    if (allLessonIds.length > 0) {
        const completed = await prisma.lessonProgress.findMany({
            where: { userId, lessonId: { in: allLessonIds }, completed: true },
            select: { lessonId: true },
        });
        completed.forEach(c => completedSet.add(c.lessonId));
    }

    return enrollments.map(e => {
        const totalLessons = e.course.modules.flatMap(m => m.lessons).length;
        const completedLessons = e.course.modules
            .flatMap(m => m.lessons)
            .filter(l => completedSet.has(l.id)).length;
        const percent = totalLessons === 0 ? 0 : Math.round((completedLessons / totalLessons) * 100);

        return {
            ...e.course,
            progress: { percent, completed: completedLessons, total: totalLessons },
        };
    });
}
