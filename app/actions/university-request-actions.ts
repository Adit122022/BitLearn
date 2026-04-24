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

export async function submitUniversityRequest(data: {
  name: string
  email: string
  website?: string
  description?: string
  contactName: string
  contactEmail: string
  message?: string
}) {
  // Anyone can submit — no auth required
  if (!data.name.trim() || !data.email.trim() || !data.contactName.trim() || !data.contactEmail.trim()) {
    throw new Error("Name, email, contact name, and contact email are required")
  }

  return prisma.universityRequest.create({ data })
}

export async function getAllUniversityRequests() {
  await getAdminSession()
  return prisma.universityRequest.findMany({
    orderBy: { createdAt: "desc" },
  })
}

export async function approveUniversityRequest(
  requestId: string,
  adminNote?: string
) {
  await getAdminSession()

  const req = await prisma.universityRequest.findUnique({ where: { id: requestId } })
  if (!req) throw new Error("Request not found")

  // Update status
  await prisma.universityRequest.update({
    where: { id: requestId },
    data: { status: "Approved", adminNote },
  })

  // Create the university
  const slug = req.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")

  const university = await prisma.university.create({
    data: {
      name: req.name,
      email: req.email,
      slug: `${slug}-${Date.now()}`,
      website: req.website,
      description: req.description,
    },
  })

  // Try to find and assign the contact as UNIVERSITY_ADMIN
  const user = await prisma.user.findFirst({
    where: { email: req.contactEmail },
  })

  if (user) {
    await prisma.user.update({
      where: { id: user.id },
      data: { role: "UNIVERSITY_ADMIN" },
    })
    await prisma.universityAdmin.upsert({
      where: { userId_universityId: { userId: user.id, universityId: university.id } },
      create: { userId: user.id, universityId: university.id },
      update: {},
    })
  }

  return { university, assignedUser: user }
}

export async function rejectUniversityRequest(requestId: string, adminNote?: string) {
  await getAdminSession()
  return prisma.universityRequest.update({
    where: { id: requestId },
    data: { status: "Rejected", adminNote },
  })
}
