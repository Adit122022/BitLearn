"use server"

import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

async function getAdminSession() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session || (session.user as any).role !== "ADMIN") {
    throw new Error("Unauthorized: Admin access required")
  }
  return session
}

function calcChange(current: number, previous: number) {
  if (previous === 0) return current > 0 ? 100 : 0
  return Math.round(((current - previous) / previous) * 100)
}

export async function getAdminStats() {
  await getAdminSession()

  const now = new Date()
  const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)

  const [
    totalRevenue,
    revenueThisMonth,
    revenueLastMonth,
    totalEnrollments,
    enrollmentsThisMonth,
    enrollmentsLastMonth,
    totalStudents,
    studentsThisMonth,
    studentsLastMonth,
    totalCourses,
    coursesThisMonth,
    coursesLastMonth,
  ] = await Promise.all([
    prisma.enrollment.aggregate({ _sum: { amount: true } }),
    prisma.enrollment.aggregate({
      _sum: { amount: true },
      where: { createdAt: { gte: startOfThisMonth } },
    }),
    prisma.enrollment.aggregate({
      _sum: { amount: true },
      where: { createdAt: { gte: startOfLastMonth, lt: startOfThisMonth } },
    }),
    prisma.enrollment.count(),
    prisma.enrollment.count({ where: { createdAt: { gte: startOfThisMonth } } }),
    prisma.enrollment.count({
      where: { createdAt: { gte: startOfLastMonth, lt: startOfThisMonth } },
    }),
    prisma.user.count(),
    prisma.user.count({ where: { createdAt: { gte: startOfThisMonth } } }),
    prisma.user.count({
      where: { createdAt: { gte: startOfLastMonth, lt: startOfThisMonth } },
    }),
    prisma.course.count({ where: { status: "Published" } }),
    prisma.course.count({
      where: { status: "Published", createdAt: { gte: startOfThisMonth } },
    }),
    prisma.course.count({
      where: {
        status: "Published",
        createdAt: { gte: startOfLastMonth, lt: startOfThisMonth },
      },
    }),
  ])

  return {
    totalRevenue: totalRevenue._sum.amount ?? 0,
    revenueChange: calcChange(
      revenueThisMonth._sum.amount ?? 0,
      revenueLastMonth._sum.amount ?? 0
    ),
    totalEnrollments,
    enrollmentChange: calcChange(enrollmentsThisMonth, enrollmentsLastMonth),
    totalStudents,
    studentChange: calcChange(studentsThisMonth, studentsLastMonth),
    totalCourses,
    courseChange: calcChange(coursesThisMonth, coursesLastMonth),
  }
}

export async function getEnrollmentTrend(days: number = 90) {
  await getAdminSession()

  const since = new Date()
  since.setDate(since.getDate() - days)

  const enrollments = await prisma.enrollment.findMany({
    where: { createdAt: { gte: since } },
    select: { createdAt: true, amount: true },
    orderBy: { createdAt: "asc" },
  })

  const byDate = new Map<string, { enrollments: number; revenue: number }>()

  for (let i = days; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const key = d.toISOString().split("T")[0]
    byDate.set(key, { enrollments: 0, revenue: 0 })
  }

  for (const e of enrollments) {
    const key = e.createdAt.toISOString().split("T")[0]
    const existing = byDate.get(key) ?? { enrollments: 0, revenue: 0 }
    byDate.set(key, {
      enrollments: existing.enrollments + 1,
      revenue: existing.revenue + e.amount,
    })
  }

  return Array.from(byDate.entries()).map(([date, data]) => ({
    date,
    enrollments: data.enrollments,
    revenue: data.revenue,
  }))
}

export async function getRecentCourses() {
  await getAdminSession()

  const courses = await prisma.course.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      user: { select: { name: true, email: true } },
      _count: { select: { enrollments: true } },
    },
  })

  return courses.map((c) => ({
    id: c.id,
    title: c.title,
    instructor: c.user?.name ?? "Unknown",
    status: c.status as string,
    price: c.price,
    enrollments: c._count.enrollments,
    createdAt: c.createdAt.toISOString(),
    slug: c.slug,
  }))
}
