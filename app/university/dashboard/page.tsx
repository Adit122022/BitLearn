import { getMyUniversity, getUniversityStats } from "@/app/actions/university-actions"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { BookOpen, Users, GraduationCap, IndianRupee } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function UniversityDashboardPage() {
  const university = await getMyUniversity()
  const stats = await getUniversityStats(university.id)

  const cards = [
    {
      label: "Total Courses",
      value: stats.totalCourses,
      icon: BookOpen,
      href: "/university/courses",
      description: "Published and draft courses",
    },
    {
      label: "Teachers",
      value: stats.totalTeachers,
      icon: Users,
      href: "/university/teachers",
      description: "Assigned to your university",
    },
    {
      label: "Enrollments",
      value: stats.totalEnrollments,
      icon: GraduationCap,
      href: "/university/courses",
      description: "Students enrolled in courses",
    },
    {
      label: "Revenue",
      value: `₹${stats.totalRevenue.toLocaleString("en-IN")}`,
      icon: IndianRupee,
      href: "/university/courses",
      description: "Total from course enrollments",
    },
  ]

  return (
    <div className="flex flex-col gap-6 p-4 lg:p-6">
      <div>
        <h1 className="text-2xl font-semibold">{university.name}</h1>
        <p className="text-muted-foreground text-sm">{university.email}</p>
        {university.description && (
          <p className="text-sm mt-1 text-muted-foreground max-w-xl">
            {university.description}
          </p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.label} className="bg-gradient-to-t from-primary/5 to-card shadow-xs">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardDescription>{card.label}</CardDescription>
                <card.icon className="size-4 text-muted-foreground" />
              </div>
              <CardTitle className="text-3xl font-semibold tabular-nums">
                {card.value}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">{card.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex gap-3">
        <Button asChild>
          <Link href="/university/teachers">Manage Teachers</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/university/courses">View Courses</Link>
        </Button>
      </div>
    </div>
  )
}
