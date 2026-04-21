"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { courseSchema } from "@/lib/zodSchemas";
import slugify from "slugify";

// Helper to get authenticated teacher session
async function getTeacherSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const userRole = (session?.user as any)?.role;
  if (!session || (userRole !== "TEACHER" && userRole !== "ADMIN")) {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function createCourse(data: unknown) {
  const session = await getTeacherSession();
  const result = courseSchema.safeParse(data);

  if (!result.success) {
    throw new Error("Invalid course data");
  }

  const courseData = result.data;

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
      userId: session.user.id,  
    },
  });

  return course;
}

export async function updateCourse(courseId: string, data: unknown) {
  const session = await getTeacherSession();
  const result = courseSchema.safeParse(data);

  if (!result.success) {
    throw new Error("Invalid course data");
  }

  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (
    !course ||
    (course.userId !== session.user.id &&
      (session.user as any).role !== "ADMIN")
  ) {
    throw new Error("Not authorized to update this course");
  }

  const courseData = result.data;

  return prisma.course.update({
    where: { id: courseId },
    data: {
      ...courseData,
      imageUrl: courseData.fileKey
        ? `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES}.t3.tigrisfiles.io/${courseData.fileKey}`
        : course.imageUrl,
    },
  });
}

export async function deleteCourse(courseId: string) {
  const session = await getTeacherSession();
  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (
    !course ||
    (course.userId !== session.user.id &&
      (session.user as any).role !== "ADMIN")
  ) {
    throw new Error("Not authorized to delete this course");
  }

  await prisma.course.delete({ where: { id: courseId } });
  return true;
}

export async function getTeacherCourses() {
  const session = await getTeacherSession();
  return prisma.course.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      modules: true,
    },
  });
}

export async function getPublicCourses() {
  return prisma.course.findMany({
    where: { status: "Published" },
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: { name: true, image: true },
      },
    },
  });
}

export async function getCourseBySlug(slug: string) {
  return prisma.course.findUnique({
    where: { slug },
    include: {
      user: {
        select: { name: true, image: true },
      },
      modules: {
        orderBy: { order: "asc" },
        include: {
          lessons: {
            orderBy: { order: "asc" },
          },
        },
      },
    },
  });
}
