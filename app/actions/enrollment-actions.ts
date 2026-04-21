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

    const enrollments = await prisma.enrollment.findMany({
        where: { userId: session.user.id },
        include: {
            course: {
                include: {
                    user: { select: { name: true, image: true } }
                }
            }
        },
        orderBy: { createdAt: "desc" }
    });

    return enrollments.map(e => e.course);
}
