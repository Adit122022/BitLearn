import { prisma } from "@/lib/db"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BookOpen, Users } from "lucide-react"
import RevokeEnrollmentButton from "./_components/revoke-button"

export default async function AdminCourseEnrollmentsPage() {
  const courses = await prisma.course.findMany({
    where: { status: "Published" },
    select: {
      id: true,
      title: true,
      slug: true,
      imageUrl: true,
      _count: {
        select: {
          enrollments: true,
        },
      },
      enrollments: {
        select: {
          id: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
              role: true,
            },
          },
          amount: true,
          paidAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <div>
        <h1 className="text-3xl font-bold">Course Enrollments</h1>
        <p className="text-muted-foreground">
          Manage student enrollments and revoke access
        </p>
      </div>

      <div className="space-y-6">
        {courses.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">
                No published courses found.
              </p>
            </CardContent>
          </Card>
        ) : (
          courses.map((course) => (
            <Card key={course.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    {course.imageUrl && (
                      <img
                        src={course.imageUrl}
                        alt={course.title}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    )}
                    <div>
                      <CardTitle>{course.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {course.slug}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant="secondary" className="mt-1">
                    <Users className="w-3 h-3 mr-1" />
                    {course._count.enrollments} students
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {course.enrollments.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No students enrolled in this course yet.
                  </p>
                ) : (
                  <div className="rounded-lg border overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Student</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Amount Paid</TableHead>
                          <TableHead>Enrollment Date</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {course.enrollments.map((enrollment) => (
                          <TableRow key={enrollment.id}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage
                                    src={enrollment.user.image || ""}
                                  />
                                  <AvatarFallback>
                                    {enrollment.user.name
                                      ?.split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="font-medium">
                                  {enrollment.user.name}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {enrollment.user.email}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  enrollment.user.role === "TEACHER"
                                    ? "default"
                                    : "outline"
                                }
                              >
                                {enrollment.user.role}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm font-medium">
                              ₹{enrollment.amount}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {new Date(enrollment.paidAt).toLocaleDateString(
                                "en-IN"
                              )}
                            </TableCell>
                            <TableCell>
                              <RevokeEnrollmentButton
                                enrollmentId={enrollment.id}
                                courseId={course.id}
                                studentName={enrollment.user.name}
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
