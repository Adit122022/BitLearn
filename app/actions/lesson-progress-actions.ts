"use server"

import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

async function getUserSession() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) throw new Error("Unauthorized")
  return session
}

export async function markLessonComplete(lessonId: string) {
  const session = await getUserSession()
  const userId = session.user.id

  return prisma.lessonProgress.upsert({
    where: { userId_lessonId: { userId, lessonId } },
    create: { userId, lessonId, completed: true },
    update: { completed: true },
  })
}

export async function markLessonIncomplete(lessonId: string) {
  const session = await getUserSession()
  const userId = session.user.id

  return prisma.lessonProgress.upsert({
    where: { userId_lessonId: { userId, lessonId } },
    create: { userId, lessonId, completed: false },
    update: { completed: false },
  })
}

export async function getCourseProgress(courseId: string) {
  const session = await getUserSession()
  const userId = session.user.id

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      modules: {
        include: { lessons: { select: { id: true } } },
      },
    },
  })

  if (!course) return { completed: 0, total: 0, percent: 0, completedIds: [] }

  const allLessonIds = course.modules.flatMap((m) => m.lessons.map((l) => l.id))

  const completedRecords = await prisma.lessonProgress.findMany({
    where: { userId, lessonId: { in: allLessonIds }, completed: true },
    select: { lessonId: true },
  })

  const completedIds = completedRecords.map((r) => r.lessonId)
  const total = allLessonIds.length
  const completed = completedIds.length
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100)

  return { completed, total, percent, completedIds }
}

export async function getCompletedCourseCount() {
  const session = await getUserSession()
  const userId = session.user.id

  const enrollments = await prisma.enrollment.findMany({
    where: { userId },
    include: {
      course: {
        include: {
          modules: { include: { lessons: { select: { id: true } } } },
        },
      },
    },
  })

  let completedCount = 0
  for (const e of enrollments) {
    const allIds = e.course.modules.flatMap((m) => m.lessons.map((l) => l.id))
    if (allIds.length === 0) continue
    const done = await prisma.lessonProgress.count({
      where: { userId, lessonId: { in: allIds }, completed: true },
    })
    if (done === allIds.length) completedCount++
  }
  return completedCount
}
