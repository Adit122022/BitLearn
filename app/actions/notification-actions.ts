"use server"

import { randomBytes } from "crypto"
import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import { resend } from "@/lib/resend"
import { env } from "@/lib/env"

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

export async function sendUniversityInviteByEmail(
  universityId: string,
  email: string,
  subject?: string
) {
  try {
    const session = await getSession()

    const role = (session.user as any).role
    if (role !== "UNIVERSITY_ADMIN" && role !== "ADMIN") {
      throw new Error("NOT_AUTHORIZED")
    }

    const university = await prisma.university.findUnique({
      where: { id: universityId },
    })
    if (!university) throw new Error("UNIVERSITY_NOT_FOUND")

    const inviteToken = randomBytes(32).toString("hex")
    const tokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

    await prisma.verification.create({
      data: {
        identifier: `university-invite:${universityId}:${email}`,
        value: inviteToken,
        expiresAt: tokenExpiry,
      },
    })

    const inviteUrl = `${env.NEXT_PUBLIC_APP_URL || "https://bitlearn.com"}/university-invite/${inviteToken}`
    const fromEmail = env.RESEND_DOMAIN ? `noreply@${env.RESEND_DOMAIN}` : "onboarding@resend.dev"

    const { error: emailError } = await resend.emails.send({
      from: `${university.name} <${fromEmail}>`,
      to: email,
      subject: `Invitation to Join ${university.name} as a Teacher`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
          <h2 style="color: #1f2937;">You're Invited!</h2>
          <p style="color: #4b5563;">You have been invited to join <strong>${university.name}</strong> on BitLearn.</p>
          <p style="color: #4b5563;">Click the button below to accept your invitation and set up your teacher account:</p>
          <div style="margin: 30px 0;">
            <a href="${inviteUrl}"
               style="background-color: #2563eb; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 500;">
              Accept Invitation
            </a>
          </div>
          <p style="color: #6b7280; font-size: 14px;">This link will expire in 7 days.</p>
        </div>
      `,
    })

    if (emailError) {
      throw new Error(`Failed to send email: ${emailError.message}`)
    }

    revalidatePath("/university/teachers")
    return { ok: true }
  } catch (error: any) {
    throw error
  }
}

export async function sendUniversityInvite(
  universityId: string,
  userId: string,
  subject?: string
) {  
  const session = await getSession()
  const role = (session.user as any).role
  if (role !== "UNIVERSITY_ADMIN" && role !== "ADMIN") throw new Error("Unauthorized")

  const [university, user, alreadyMember, pendingInvite] = await Promise.all([
    prisma.university.findUnique({ where: { id: universityId }, select: { name: true, email: true } }),
    prisma.user.findUnique({ where: { id: userId }, select: { name: true, email: true } }),
    prisma.universityTeacher.findUnique({
      where: { userId_universityId: { userId, universityId } },
    }),
    prisma.notification.findFirst({
      where: { receiverId: userId, universityId, type: "UNIVERSITY_INVITE", status: "PENDING" },
    }),
  ])

  if (!university) throw new Error("University not found")
  if (!user) throw new Error("User not found")
  if (alreadyMember) throw new Error("User is already a member of this university")
  if (pendingInvite) throw new Error("A pending invite already exists for this user")

  const message = subject
    ? `You have been invited to join ${university.name} as a teacher. Subject: ${subject}`
    : `You have been invited to join ${university.name} as a teacher.`

  const notification = await prisma.notification.create({
    data: {
      type: "UNIVERSITY_INVITE",
      title: `Invitation to join ${university.name}`,
      message,
      senderId: session.user.id,
      receiverId: userId,
      universityId,
    },
  })

  const fromEmail = env.RESEND_DOMAIN ? `noreply@${env.RESEND_DOMAIN}` : "onboarding@resend.dev"
  const { error: emailError } = await resend.emails.send({
    from: `${university.name} <${fromEmail}>`,
    to: user.email,
    subject: `Join ${university.name} as a Teacher`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Welcome, ${user.name}!</h2>
        <p>You have been invited to join <strong>${university.name}</strong> as a teacher.</p>
        ${subject ? `<p><strong>Subject/Department:</strong> ${subject}</p>` : ""}
        <p>Click the button below to accept this invitation:</p>
        <p>
          <a href="${env.NEXT_PUBLIC_APP_URL || "https://bit-learn.vercel.app"}/inbox?tab=university-invites"
             style="display: inline-block; padding: 12px 24px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 6px;">
            View Invitation
          </a>
        </p>
        <p>After accepting, you'll be able to sign in with Google, GitHub, or email and manage courses for ${university.name}.</p>
        <p style="color: #666; font-size: 14px;">If you didn't expect this invitation, you can ignore this email or contact ${university.name}.</p>
      </div>
    `,
  })

  if (emailError) {
    throw new Error(`Failed to send invitation email: ${emailError.message}`)
  }

  revalidatePath("/university/teachers")
  return notification
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

  // Actually assign the course by updating the userId (owner)
  await prisma.course.update({
    where: { id: courseId },
    data: { userId: userId }
  })

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
