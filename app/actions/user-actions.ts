"use server"

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

async function getAdminSession() {
    const session = await auth.api.getSession({
        headers: await headers()
    });
    if (!session || (session.user as any).role !== "ADMIN") {
        throw new Error("Unauthorized: Admin access required");
    }
    return session;
}

export async function getAllUsers() {
    await getAdminSession();
    return prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        include: {
            courses: {
                select: { id: true, title: true, status: true }
            }
        }
    });
}

export async function deleteUserAndData(userId: string) {
    await getAdminSession();
    
    // Because better-auth associations or courses might restrict deletions without cascade,
    // we manually remove major entity blocks linked to the user.
    await prisma.course.deleteMany({ where: { userId } });
    await prisma.teacherProfile.deleteMany({ where: { userId } });
    await prisma.teacherApplication.deleteMany({ where: { userId } });
    await prisma.enrollment.deleteMany({ where: { userId } });
    
    // Finally delete user
    await prisma.user.delete({ where: { id: userId } });
    return true;
}

export async function revokeTeacherRole(userId: string) {
    await getAdminSession();
    
    await prisma.user.update({
        where: { id: userId },
        data: { role: "STUDENT" }
    });
    
    // Note: We leave their courses intact so they are simply orphaned or frozen, 
    // but we revoke profile.
    await prisma.teacherProfile.deleteMany({ where: { userId } });
    return true;
}

export async function adminDeleteCourse(courseId: string) {
    await getAdminSession();
    await prisma.course.delete({ where: { id: courseId } });
    return true;
}

export async function deleteMyAccount() {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) throw new Error("Not authenticated")
    const userId = session.user.id

    await prisma.enrollment.deleteMany({ where: { userId } })
    await prisma.teacherApplication.deleteMany({ where: { userId } })
    await prisma.teacherProfile.deleteMany({ where: { userId } })
    await prisma.course.deleteMany({ where: { userId } })
    await prisma.user.delete({ where: { id: userId } })
    return true
}
