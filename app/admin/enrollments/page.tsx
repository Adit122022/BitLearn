import { getEnrollments } from "@/app/actions/admin-enrollment-actions"
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import EnrollmentActions from "./_components/enrollment-actions"

export default async function EnrollmentsPage() {
  const enrollments = await getEnrollments()

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <div>
        <h1 className="text-3xl font-bold">Course Enrollments</h1>
        <p className="text-muted-foreground">
          Manage student enrollments across all courses
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Enrollments</CardTitle>
          <CardDescription>
            Total: {enrollments.length} students enrolled
          </CardDescription>
        </CardHeader>
        <CardContent>
          {enrollments.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No enrollments yet.
            </p>
          ) : (
            <div className="rounded-lg border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {enrollments.map((enrollment) => (
                    <TableRow key={enrollment.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">
                            {enrollment.user.name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {enrollment.user.email}
                      </TableCell>
                      <TableCell className="text-sm">
                        {enrollment.course.title}
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
                        <EnrollmentActions
                          enrollmentId={enrollment.id}
                          courseId={enrollment.courseId}
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
    </div>
  )
}
