"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { courseSchema } from "@/lib/zodSchemas";
import { revalidatePath } from "next/cache";

// Helper to get authenticated teacher session
async function getTeacherSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const userRole = (session?.user as any)?.role;
  if (!session || (userRole !== "TEACHER" && userRole !== "ADMIN" && userRole !== "UNIVERSITY_ADMIN")) {
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

  revalidatePath("/admin/courses");
  revalidatePath("/courses");
  revalidatePath("/");

  return course;
}

export async function updateCourse(courseId: string, data: unknown) {
  const session = await getTeacherSession();
  const result = courseSchema.safeParse(data);

  if (!result.success) {
    throw new Error("Invalid course data");
  }

  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) {
    throw new Error("Course not found");
  }

  const isCreator = course.userId === session.user.id;
  const isAdmin = (session.user as any).role === "ADMIN";
  let isUniversityTeacher = false;

  if (course.universityId) {
    const teacherRecord = await prisma.universityTeacher.findUnique({
      where: {
        userId_universityId: {
          userId: session.user.id,
          universityId: course.universityId,
        },
      },
    });
    isUniversityTeacher = !!teacherRecord;
  }

  if (!isCreator && !isAdmin && !isUniversityTeacher) {
    throw new Error("Not authorized to update this course");
  }

  const courseData = result.data;

  const updated = await prisma.course.update({
    where: { id: courseId },
    data: {
      ...courseData,
      imageUrl: courseData.fileKey
        ? `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES}.t3.tigrisfiles.io/${courseData.fileKey}`
        : course.imageUrl,
    },
  });

  revalidatePath("/admin/courses");
  revalidatePath(`/admin/courses/${courseId}`);
  revalidatePath("/courses");
  revalidatePath(`/courses/${updated.slug}`);
  revalidatePath("/");

  return updated;
}

export async function deleteCourse(courseId: string) {
  const session = await getTeacherSession();
  const course = await prisma.course.findUnique({ where: { id: courseId } });

  if (!course) {
    throw new Error("Course not found");
  }

  const isCreator = course.userId === session.user.id;
  const isAdmin = (session.user as any).role === "ADMIN";
  let isUniversityTeacher = false;

  if (course.universityId) {
    const teacherRecord = await prisma.universityTeacher.findUnique({
      where: {
        userId_universityId: {
          userId: session.user.id,
          universityId: course.universityId,
        },
      },
    });
    isUniversityTeacher = !!teacherRecord;
  }

  if (!isCreator && !isAdmin && !isUniversityTeacher) {
    throw new Error("Not authorized to delete this course");
  }

  await prisma.course.delete({ where: { id: courseId } });

  revalidatePath("/admin/courses");
  revalidatePath("/courses");
  revalidatePath("/");

  return true;
}

export async function getTeacherCourses() {
  const session = await getTeacherSession();
  const userRole = (session.user as any).role;

  // ADMIN can see ALL courses; TEACHER only sees their own
  const where = userRole === "ADMIN" ? {} : { userId: session.user.id };

  return prisma.course.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      modules: true,
      user: { select: { name: true, email: true } },
    },
  });
}

// Dedicated admin-only function to get all courses with full details
export async function getAllCoursesAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  const userRole = (session?.user as any)?.role;
  if (!session || userRole !== "ADMIN") throw new Error("Unauthorized");

  return prisma.course.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      modules: true,
      user: { select: { name: true, email: true } },
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
      university: {
        select: { id: true, name: true, logo: true },
      },
    },
  });
}

export async function getCourseBySlug(slug: string) {
  return prisma.course.findUnique({
    where: { slug },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
          universityTeacherOf: {
            include: {
              university: { select: { id: true, name: true, logo: true } },
            },
          },
        },
      },
      university: { select: { id: true, name: true, logo: true } },
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
