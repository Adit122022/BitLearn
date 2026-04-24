import { getMyUniversity, getUniversityCourses } from "@/app/actions/university-actions"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { BookOpen, Users } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const statusVariant: Record<string, "default" | "secondary" | "outline"> = {
  Published: "default",
  Draft: "secondary",
  Archived: "outline",
}

export default async function UniversityCoursesPage() {
  const university = await getMyUniversity()
  const courses = await getUniversityCourses(university.id)

  return (
    <div className="flex flex-col gap-6 p-4 lg:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Courses</h1>
          <p className="text-muted-foreground text-sm">
            Courses published under {university.name}
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/courses/create">Create Course</Link>
        </Button>
      </div>

      {courses.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 gap-3">
            <BookOpen className="size-12 text-muted-foreground" />
            <p className="text-muted-foreground">No courses yet for this university.</p>
            <Button asChild variant="outline">
              <Link href="/admin/courses/create">Create the first course</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {courses.map((course) => (
            <Card key={course.id} className="overflow-hidden">
              {course.imageUrl && (
                <div className="relative h-36 w-full">
                  <Image
                    src={course.imageUrl}
                    alt={course.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-sm font-medium leading-tight line-clamp-2">
                    {course.title}
                  </CardTitle>
                  <Badge variant={statusVariant[course.status] ?? "outline"}>
                    {course.status}
                  </Badge>
                </div>
                <CardDescription className="text-xs">
                  by {course.user?.name ?? "Unknown"}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-between pt-0">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Users className="size-3.5" />
                    {(course._count as any).enrollments}
                  </span>
                  <span className="font-medium text-foreground">
                    ₹{course.price.toLocaleString("en-IN")}
                  </span>
                </div>
                <Button size="sm" variant="outline" asChild>
                  <Link href={`/admin/courses/${course.id}`}>Edit</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
