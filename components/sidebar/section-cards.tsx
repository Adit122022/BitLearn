import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type Stats = {
  totalRevenue: number
  revenueChange: number
  totalStudents: number
  studentChange: number
  totalCourses: number
  courseChange: number
  totalEnrollments: number
  enrollmentChange: number
}

export function SectionCards({ stats }: { stats: Stats }) {
  const cards = [
    {
      label: "Total Revenue",
      value: `₹${stats.totalRevenue.toLocaleString("en-IN")}`,
      change: stats.revenueChange,
      subtitle: "From all course enrollments",
    },
    {
      label: "Total Students",
      value: stats.totalStudents.toLocaleString("en-IN"),
      change: stats.studentChange,
      subtitle: "Registered on platform",
    },
    {
      label: "Published Courses",
      value: stats.totalCourses.toLocaleString("en-IN"),
      change: stats.courseChange,
      subtitle: "Live courses available",
    },
    {
      label: "Total Enrollments",
      value: stats.totalEnrollments.toLocaleString("en-IN"),
      change: stats.enrollmentChange,
      subtitle: "Course enrollments overall",
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      {cards.map((card) => {
        const isUp = card.change >= 0
        return (
          <Card key={card.label} className="@container/card">
            <CardHeader>
              <CardDescription>{card.label}</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {card.value}
              </CardTitle>
              <CardAction>
                <Badge variant="outline">
                  {isUp ? <IconTrendingUp /> : <IconTrendingDown />}
                  {isUp ? "+" : ""}
                  {card.change}%
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                {isUp ? "Up" : "Down"} {Math.abs(card.change)}% vs last month{" "}
                {isUp ? (
                  <IconTrendingUp className="size-4" />
                ) : (
                  <IconTrendingDown className="size-4" />
                )}
              </div>
              <div className="text-muted-foreground">{card.subtitle}</div>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}
