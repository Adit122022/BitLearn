import { getMyUniversity, getUniversityCourses } from "@/app/actions/university-actions"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { BookOpen, Edit2, LayoutList, Plus, Users } from "lucide-react"
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
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Courses</h1>
          <p className="text-muted-foreground text-sm">
            Courses published under {university.name}
          </p>
        </div>
        <Button asChild>
          <Link href="/university/courses/create">
            <Plus className="size-4" />
            Create Course
          </Link>
        </Button>
      </div>

      {courses.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 gap-3">
            <BookOpen className="size-12 text-muted-foreground" />
            <p className="text-muted-foreground">No courses yet.</p>
            <Button asChild variant="outline">
              <Link href="/university/courses/create">Create your first course</Link>
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
              <CardContent className="flex items-center gap-3 pt-0 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Users className="size-3.5" />
                  {(course._count as any).enrollments} students
                </span>
                <span className="font-medium text-foreground">
                  ₹{course.price.toLocaleString("en-IN")}
                </span>
              </CardContent>
              <CardFooter className="flex gap-2 pt-0">
                <Button asChild variant="outline" size="sm" className="flex-1">
                  <Link href={`/university/courses/${course.id}`}>
                    <Edit2 className="size-3.5 mr-1.5" />
                    Edit Info
                  </Link>
                </Button>
                <Button asChild variant="outline" size="sm" className="flex-1">
                  <Link href={`/university/courses/${course.id}/modules`}>
                    <LayoutList className="size-3.5 mr-1.5" />
                    Curriculum
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
