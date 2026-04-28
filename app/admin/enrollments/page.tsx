import { getEnrollments } from "@/app/actions/admin-enrollment-actions"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import EnrollmentActions from "./_components/enrollment-actions"

export default async function EnrollmentsPage() {
  const enrollments = await getEnrollments()

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "user.name",
      header: "Student Name",
    },
    {
      accessorKey: "user.email",
      header: "Email",
    },
    {
      accessorKey: "course.title",
      header: "Course",
    },
    {
      accessorKey: "amount",
      header: "Amount Paid",
      cell: ({ row }) => `₹${row.original.amount}`,
    },
    {
      accessorKey: "paidAt",
      header: "Enrollment Date",
      cell: ({ row }) =>
        new Date(row.original.paidAt).toLocaleDateString("en-IN"),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <EnrollmentActions
          enrollmentId={row.original.id}
          courseId={row.original.courseId}
          studentName={row.original.user.name}
        />
      ),
    },
  ]

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
          <DataTable columns={columns} data={enrollments} />
        </CardContent>
      </Card>
    </div>
  )
}
