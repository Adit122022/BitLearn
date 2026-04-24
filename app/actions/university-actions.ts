"use server"

import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import slugify from "slugify"
import { courseSchema } from "@/lib/zodSchemas"

async function getAdminSession() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session || (session.user as any).role !== "ADMIN") {
    throw new Error("Unauthorized: Admin access required")
  }
  return session
}

async function getUniversityAdminSession() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) throw new Error("Unauthorized")
  const role = (session.user as any).role
  if (role !== "UNIVERSITY_ADMIN") {
    throw new Error("Unauthorized: University Admin access required")
  }
  return session
}

// ── Global Admin: Manage Universities ─────────────────────────────────────────

export async function createUniversity(data: {
  name: string
  email: string
  description?: string
  website?: string
}) {
  await getAdminSession()

  const slug = slugify(data.name, { lower: true, strict: true })

  return prisma.university.create({
    data: {
      name: data.name,
      email: data.email,
      slug,
      description: data.description,
      website: data.website,
    },
  })
}

export async function getAllUniversities() {
  await getAdminSession()

  return prisma.university.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      admins: { include: { user: { select: { id: true, name: true, email: true } } } },
      _count: { select: { teachers: true, courses: true } },
    },
  })
}

export async function assignUniversityAdmin(universityId: string, userId: string) {
  await getAdminSession()

  await prisma.user.update({
    where: { id: userId },
    data: { role: "UNIVERSITY_ADMIN" },
  })

  return prisma.universityAdmin.upsert({
    where: { userId_universityId: { userId, universityId } },
    create: { userId, universityId },
    update: {},
  })
}

export async function removeUniversityAdmin(universityId: string, userId: string) {
  await getAdminSession()

  await prisma.universityAdmin.delete({
    where: { userId_universityId: { userId, universityId } },
  })

  // Downgrade role only if not admin of another university
  const otherAdminships = await prisma.universityAdmin.count({ where: { userId } })
  if (otherAdminships === 0) {
    await prisma.user.update({ where: { id: userId }, data: { role: "STUDENT" } })
  }
}

export async function deleteUniversity(universityId: string) {
  await getAdminSession()

  // Reset roles for all university admins
  const admins = await prisma.universityAdmin.findMany({ where: { universityId } })
  for (const a of admins) {
    const other = await prisma.universityAdmin.count({
      where: { userId: a.userId, universityId: { not: universityId } },
    })
    if (other === 0) {
      await prisma.user.update({ where: { id: a.userId }, data: { role: "STUDENT" } })
    }
  }

  return prisma.university.delete({ where: { id: universityId } })
}

export async function toggleUniversityStatus(universityId: string, isActive: boolean) {
  await getAdminSession()
  return prisma.university.update({ where: { id: universityId }, data: { isActive } })
}

// ── University Admin: Manage own university ────────────────────────────────────

export async function getMyUniversity() {
  const session = await getUniversityAdminSession()
  const userId = session.user.id

  const adminRecord = await prisma.universityAdmin.findFirst({
    where: { userId },
    include: { university: true },
  })

  if (!adminRecord) throw new Error("No university association found")
  return adminRecord.university
}

export async function getUniversityStats(universityId: string) {
  const session = await getUniversityAdminSession()
  const userId = session.user.id

  const adminRecord = await prisma.universityAdmin.findUnique({
    where: { userId_universityId: { userId, universityId } },
  })
  if (!adminRecord) throw new Error("Unauthorized")

  const [totalCourses, totalTeachers, enrollmentData, revenueData] = await Promise.all([
    prisma.course.count({ where: { universityId } }),
    prisma.universityTeacher.count({ where: { universityId } }),
    prisma.enrollment.count({
      where: { course: { universityId } },
    }),
    prisma.enrollment.aggregate({
      _sum: { amount: true },
      where: { course: { universityId } },
    }),
  ])

  return {
    totalCourses,
    totalTeachers,
    totalEnrollments: enrollmentData,
    totalRevenue: revenueData._sum.amount ?? 0,
  }
}

export async function getUniversityTeachers(universityId: string) {
  const session = await getUniversityAdminSession()
  const userId = session.user.id

  const adminRecord = await prisma.universityAdmin.findUnique({
    where: { userId_universityId: { userId, universityId } },
  })
  if (!adminRecord) throw new Error("Unauthorized")

  return prisma.universityTeacher.findMany({
    where: { universityId },
    include: {
      user: { select: { id: true, name: true, email: true, image: true } },
    },
    orderBy: { createdAt: "desc" },
  })
}

export async function assignTeacherToUniversity(
  universityId: string,
  userId: string,
  subject?: string
) {
  const session = await getUniversityAdminSession()
  const adminId = session.user.id

  const adminRecord = await prisma.universityAdmin.findUnique({
    where: { userId_universityId: { userId: adminId, universityId } },
  })
  if (!adminRecord) throw new Error("Unauthorized")

  // Ensure the user has TEACHER role
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) throw new Error("User not found")
  if ((user as any).role !== "TEACHER" && (user as any).role !== "ADMIN") {
    await prisma.user.update({ where: { id: userId }, data: { role: "TEACHER" } })
  }

  return prisma.universityTeacher.upsert({
    where: { userId_universityId: { userId, universityId } },
    create: { userId, universityId, subject },
    update: { subject },
  })
}

export async function removeTeacherFromUniversity(universityId: string, userId: string) {
  const session = await getUniversityAdminSession()
  const adminId = session.user.id

  const adminRecord = await prisma.universityAdmin.findUnique({
    where: { userId_universityId: { userId: adminId, universityId } },
  })
  if (!adminRecord) throw new Error("Unauthorized")

  return prisma.universityTeacher.delete({
    where: { userId_universityId: { userId, universityId } },
  })
}

export async function getUniversityCourses(universityId: string) {
  const session = await getUniversityAdminSession()
  const userId = session.user.id

  const adminRecord = await prisma.universityAdmin.findUnique({
    where: { userId_universityId: { userId, universityId } },
  })
  if (!adminRecord) throw new Error("Unauthorized")

  return prisma.course.findMany({
    where: { universityId },
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true } },
      _count: { select: { enrollments: true } },
    },
  })
}

export async function getAllTeachersForAssignment() {
  await getUniversityAdminSession()

  return prisma.user.findMany({
    where: { role: "TEACHER" },
    select: { id: true, name: true, email: true, image: true },
    orderBy: { name: "asc" },
  })
}

export async function getAllUsersForInvite() {
  await getUniversityAdminSession()

  return prisma.user.findMany({
    where: { role: { in: ["TEACHER", "STUDENT"] } },
    select: { id: true, name: true, email: true, image: true, role: true },
    orderBy: { name: "asc" },
  })
}

export async function createUniversityCourse(data: unknown) {
  const session = await getUniversityAdminSession()
  const userId = session.user.id

  const result = courseSchema.safeParse(data)
  if (!result.success) throw new Error("Invalid course data")
  const courseData = result.data

  const adminRecord = await prisma.universityAdmin.findFirst({ where: { userId } })
  if (!adminRecord) throw new Error("No university association found")

  const course = await prisma.course.create({
    data: {
      title: courseData.title,
      description: courseData.description,
      fileKey: courseData.fileKey,
      price: courseData.price,
      duration: courseData.duration,
      level: courseData.level,
      category: courseData.category,
      smallDescription: courseData.smallDescription,
      slug: courseData.slug,
      status: courseData.status,
      imageUrl: `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES}.t3.tigrisfiles.io/${courseData.fileKey}`,
      userId,
      universityId: adminRecord.universityId,
    },
  })

  revalidatePath("/university/courses")
  revalidatePath("/courses")
  return course
}
