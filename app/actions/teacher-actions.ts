"use server"

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { z } from "zod";

async function getUserSession() {
    const session = await auth.api.getSession({
        headers: await headers()
    });
    if (!session) {
        throw new Error("Unauthorized");
    }
    return session;
}

async function getAdminSession() {
    const session = await getUserSession();
    if ((session.user as any).role !== "ADMIN") {
        throw new Error("Unauthorized admin access");
    }
    return session;
}

const applicationSchema = z.object({
    bio: z.string().min(10)
});

export async function applyToBeTeacher(data: { bio: string }) {
    const session = await getUserSession();
    
    // Check if application exists
    const existing = await prisma.teacherApplication.findUnique({
        where: { userId: session.user.id }
    });

    if (existing) {
        throw new Error("You have already applied.");
    }

    const val = applicationSchema.safeParse(data);
    if (!val.success) throw new Error("Invalid format");

    return prisma.teacherApplication.create({
        data: {
            userId: session.user.id,
            bio: val.data.bio,
            status: "Pending"
        }
    });
}

export async function checkApplicationStatus() {
    const session = await getUserSession();
    const app = await prisma.teacherApplication.findUnique({
        where: { userId: session.user.id }
    });
    return app?.status || null;
}

export async function getPendingApplications() {
    await getAdminSession();
    return prisma.teacherApplication.findMany({
        where: { status: "Pending" },
        include: {
            user: { select: { name: true, email: true, image: true } }
        },
        orderBy: { createdAt: "asc" }
    });
}

export async function approveTeacher(applicationId: string) {
    await getAdminSession();
    
    const app = await prisma.teacherApplication.findUnique({ where: { id: applicationId } });
    if (!app) throw new Error("Not found");

    // 1. Mark as approved
    await prisma.teacherApplication.update({
        where: { id: applicationId },
        data: { status: "Approved" }
    });

    // 2. Update user role
    await prisma.user.update({
        where: { id: app.userId },
        data: { role: "TEACHER" }
    });

    // 3. Create TeacherProfile
    await prisma.teacherProfile.create({
        data: {
            userId: app.userId,
            bio: app.bio
        }
    });

    return true;
}

export async function rejectTeacher(applicationId: string) {
    await getAdminSession();
    return prisma.teacherApplication.update({
        where: { id: applicationId },
        data: { status: "Rejected" }
    });
}
