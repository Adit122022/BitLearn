import { getUniversityCourseStudents } from "@/app/actions/admin-enrollment-actions"
import { getCourseBySlug } from "@/app/actions/course-actions"
import { getMyUniversity } from "@/app/actions/university-actions"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import UniversityCourseStudentActions from "./_components/student-actions"

export default async function CourseStudentsPage({
  params,
}: {
  params: Promise<{ courseId: string }>
}) {
  const { courseId } = await params
  const university = await getMyUniversity()
  const students = await getUniversityCourseStudents(courseId, university.id)

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    select: { title: true, universityId: true },
  })

  if (!course || course.universityId !== university.id) {
    return <div>Course not found</div>
  }

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/university/courses">
            <ChevronLeft className="w-4 h-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{course.title}</h1>
          <p className="text-muted-foreground">Manage enrolled students</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Enrolled Students</CardTitle>
          <CardDescription>
            Total: {students.length} students enrolled
          </CardDescription>
        </CardHeader>
        <CardContent>
          {students.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No students enrolled yet.
            </p>
          ) : (
            <div className="space-y-4">
              {students.map((enrollment) => (
                <div
                  key={enrollment.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage
                        src={enrollment.user.image || ""}
                        alt={enrollment.user.name}
                      />
                      <AvatarFallback>
                        {enrollment.user.name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{enrollment.user.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {enrollment.user.email}
                      </p>
                    </div>
                  </div>
                  <UniversityCourseStudentActions
                    enrollmentId={enrollment.id}
                    universityId={university.id}
                    studentName={enrollment.user.name}
                  />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

import { prisma } from "@/lib/db"
