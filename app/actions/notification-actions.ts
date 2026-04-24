"use server"

import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"

async function getSession() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) throw new Error("Unauthorized")
  return session
}

export async function getMyNotifications() {
  const session = await getSession()
  return prisma.notification?.findMany({
    where: { receiverId: session.user.id },
    include: {
      sender: { select: { id: true, name: true, image: true } },
      university: { select: { id: true, name: true, logo: true } },
      course: { select: { id: true, title: true, slug: true, imageUrl: true } },
    },
    orderBy: { createdAt: "desc" },
  })
}

export async function getUnreadCount() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return 0
  return prisma.notification.count({
    where: { receiverId: session.user.id, status: "PENDING" },
  })
}

export async function markAsRead(id: string) {
  const session = await getSession()
  await prisma.notification.updateMany({
    where: { id, receiverId: session.user.id },
    data: { status: "READ" },
  })
  revalidatePath("/inbox")
}

export async function markAllAsRead() {
  const session = await getSession()
  await prisma.notification.updateMany({
    where: { receiverId: session.user.id, status: "PENDING" },
    data: { status: "READ" },
  })
  revalidatePath("/inbox")
}

export async function sendUniversityInvite(
  universityId: string,
  userId: string,
  subject?: string
) {
  const session = await getSession()
  const role = (session.user as any).role
  if (role !== "UNIVERSITY_ADMIN" && role !== "ADMIN") throw new Error("Unauthorized")

  const [university, alreadyMember, pendingInvite] = await Promise.all([
    prisma.university.findUnique({ where: { id: universityId }, select: { name: true } }),
    prisma.universityTeacher.findUnique({
      where: { userId_universityId: { userId, universityId } },
    }),
    prisma.notification.findFirst({
      where: { receiverId: userId, universityId, type: "UNIVERSITY_INVITE", status: "PENDING" },
    }),
  ])

  if (!university) throw new Error("University not found")
  if (alreadyMember) throw new Error("User is already a member of this university")
  if (pendingInvite) throw new Error("A pending invite already exists for this user")

  await prisma.notification.create({
    data: {
      type: "UNIVERSITY_INVITE",
      title: `Invitation to join ${university.name}`,
      message: subject
        ? `You have been invited to join ${university.name} as a teacher. Subject: ${subject}`
        : `You have been invited to join ${university.name} as a teacher.`,
      senderId: session.user.id,
      receiverId: userId,
      universityId,
    },
  })

  revalidatePath("/university/teachers")
}

export async function acceptUniversityInvite(notificationId: string) {
  const session = await getSession()

  const notification = await prisma.notification.findFirst({
    where: {
      id: notificationId,
      receiverId: session.user.id,
      type: "UNIVERSITY_INVITE",
      status: "PENDING",
    },
  })
  if (!notification) throw new Error("Invite not found or already processed")
  if (!notification.universityId) throw new Error("Invalid invite — no university linked")

  await prisma.$transaction([
    prisma.universityTeacher.upsert({
      where: {
        userId_universityId: {
          userId: session.user.id,
          universityId: notification.universityId,
        },
      },
      create: { userId: session.user.id, universityId: notification.universityId },
      update: {},
    }),
    prisma.notification.update({
      where: { id: notificationId },
      data: { status: "ACCEPTED" },
    }),
  ])

  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (user && (user as any).role === "STUDENT") {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { role: "TEACHER" },
    })
  }

  revalidatePath("/inbox")
  revalidatePath("/dashboard")
}

export async function rejectNotification(notificationId: string) {
  const session = await getSession()
  await prisma.notification.updateMany({
    where: { id: notificationId, receiverId: session.user.id },
    data: { status: "REJECTED" },
  })
  revalidatePath("/inbox")
}

export async function sendCourseAssignment(
  universityId: string,
  courseId: string,
  userId: string
) {
  const session = await getSession()
  const role = (session.user as any).role
  if (role !== "UNIVERSITY_ADMIN" && role !== "ADMIN") throw new Error("Unauthorized")

  const [university, course] = await Promise.all([
    prisma.university.findUnique({ where: { id: universityId }, select: { name: true } }),
    prisma.course.findUnique({ where: { id: courseId }, select: { title: true } }),
  ])
  if (!university || !course) throw new Error("University or course not found")

  await prisma.notification.create({
    data: {
      type: "COURSE_ASSIGNMENT",
      title: `Course assigned: ${course.title}`,
      message: `You have been assigned to teach "${course.title}" at ${university.name}.`,
      senderId: session.user.id,
      receiverId: userId,
      universityId,
      courseId,
    },
  })

  revalidatePath("/university/courses")
}
