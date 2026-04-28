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

async function checkAdminRole(session: any) {
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  })
  if (user?.role !== "ADMIN") throw new Error("Unauthorized - Admin only")
}

async function checkUniversityAdminRole(session: any, universityId: string) {
  const admin = await prisma.universityAdmin.findUnique({
    where: {
      userId_universityId: {
        userId: session.user.id,
        universityId,
      },
    },
  })
  if (!admin) throw new Error("Unauthorized - Not a university admin")
}

export async function getEnrollments(courseId?: string, universityId?: string) {
  const session = await getSession()
  await checkAdminRole(session)

  const where: any = {}
  if (courseId) where.courseId = courseId
  if (universityId) where.course = { universityId }

  return prisma.enrollment.findMany({
    where,
    include: {
      user: { select: { id: true, name: true, email: true, image: true } },
      course: { select: { id: true, title: true } },
    },
    orderBy: { createdAt: "desc" },
  })
}

export async function getUniversityEnrollments(universityId: string) {
  const session = await getSession()
  await checkUniversityAdminRole(session, universityId)

  return prisma.enrollment.findMany({
    where: {
      course: { universityId },
    },
    include: {
      user: { select: { id: true, name: true, email: true, image: true } },
      course: { select: { id: true, title: true } },
    },
    orderBy: { createdAt: "desc" },
  })
}

export async function removeStudentFromCourse(enrollmentId: string, courseId: string) {
  const session = await getSession()
  await checkAdminRole(session)

  const enrollment = await prisma.enrollment.findUnique({
    where: { id: enrollmentId },
    include: { course: true },
  })

  if (!enrollment || enrollment.courseId !== courseId) {
    throw new Error("Enrollment not found")
  }

  await prisma.enrollment.delete({
    where: { id: enrollmentId },
  })

  revalidatePath(`/admin/courses/${courseId}/enrollments`)
  revalidatePath(`/admin/analytics`)
}

export async function removeStudentFromUniversityCourse(
  enrollmentId: string,
  universityId: string
) {
  const session = await getSession()
  await checkUniversityAdminRole(session, universityId)

  const enrollment = await prisma.enrollment.findUnique({
    where: { id: enrollmentId },
    include: { course: true },
  })

  if (!enrollment || enrollment.course.universityId !== universityId) {
    throw new Error("Enrollment not found")
  }

  await prisma.enrollment.delete({
    where: { id: enrollmentId },
  })

  revalidatePath(`/university/courses/${enrollment.courseId}/students`)
  revalidatePath(`/university/dashboard`)
}

export async function getCourseStudents(courseId: string) {
  const session = await getSession()
  await checkAdminRole(session)

  return prisma.enrollment.findMany({
    where: { courseId },
    include: {
      user: { select: { id: true, name: true, email: true, image: true, role: true } },
    },
    orderBy: { createdAt: "desc" },
  })
}

export async function getUniversityCourseStudents(courseId: string, universityId: string) {
  const session = await getSession()
  await checkUniversityAdminRole(session, universityId)

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    select: { universityId: true },
  })

  if (course?.universityId !== universityId) throw new Error("Unauthorized")

  return prisma.enrollment.findMany({
    where: { courseId },
    include: {
      user: { select: { id: true, name: true, email: true, image: true, role: true } },
    },
    orderBy: { createdAt: "desc" },
  })
}

export async function getAdminAnalytics() {
  const session = await getSession()
  await checkAdminRole(session)

  const [totalUsers, totalTeachers, totalCourses, totalEnrollments, totalRevenue, enrollmentTrend] =
    await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: "TEACHER" } }),
      prisma.course.count({ where: { status: "Published" } }),
      prisma.enrollment.count(),
      prisma.enrollment.aggregate({
        _sum: { amount: true },
      }),
      prisma.enrollment.groupBy({
        by: ["createdAt"],
        _count: true,
      }),
    ])

  return {
    totalUsers,
    totalTeachers,
    totalCourses,
    totalEnrollments,
    totalRevenue: enrollmentTrend._sum?.amount || 0,
  }
}

export async function getUniversityAnalytics(universityId: string) {
  const session = await getSession()
  await checkUniversityAdminRole(session, universityId)

  const [totalCourses, totalTeachers, totalEnrollments, totalRevenue] = await Promise.all([
    prisma.course.count({
      where: { universityId },
    }),
    prisma.universityTeacher.count({
      where: { universityId },
    }),
    prisma.enrollment.count({
      where: {
        course: { universityId },
      },
    }),
    prisma.enrollment.aggregate({
      where: {
        course: { universityId },
      },
      _sum: { amount: true },
    }),
  ])

  return {
    totalCourses,
    totalTeachers,
    totalEnrollments,
    totalRevenue: totalRevenue._sum?.amount || 0,
  }
}
