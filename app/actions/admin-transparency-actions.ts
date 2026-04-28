"use server"

import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

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

export async function getAllUniversities() {
  const session = await getSession()
  await checkAdminRole(session)

  return prisma.university.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      slug: true,
      description: true,
      logo: true,
      isActive: true,
      createdAt: true,
      _count: {
        select: {
          courses: true,
          teachers: true,
          admins: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })
}

export async function getAllTeachers() {
  const session = await getSession()
  await checkAdminRole(session)

  return prisma.user.findMany({
    where: { role: "TEACHER" },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      createdAt: true,
      _count: {
        select: {
          courses: true,
          enrollments: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })
}

export async function getAllUsers() {
  const session = await getSession()
  await checkAdminRole(session)

  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      createdAt: true,
      emailVerified: true,
      _count: {
        select: {
          enrollments: true,
          courses: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })
}

export async function getUniversityDetails(universityId: string) {
  const session = await getSession()
  await checkAdminRole(session)

  return prisma.university.findUnique({
    where: { id: universityId },
    include: {
      admins: {
        select: {
          user: { select: { id: true, name: true, email: true, image: true } },
        },
      },
      teachers: {
        select: {
          user: { select: { id: true, name: true, email: true, image: true } },
        },
      },
      courses: {
        select: {
          id: true,
          title: true,
          status: true,
          _count: { select: { enrollments: true } },
        },
      },
    },
  })
}
