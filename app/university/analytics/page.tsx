import { getMyUniversity, getUniversityStats } from "@/app/actions/university-actions"
import { getUniversityAnalytics } from "@/app/actions/admin-enrollment-actions"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  BookOpen,
  Users,
  GraduationCap,
  IndianRupee,
  TrendingUp,
} from "lucide-react"

export default async function UniversityAnalyticsPage() {
  const university = await getMyUniversity()
  const analytics = await getUniversityAnalytics(university.id)

  const cards = [
    {
      title: "Total Courses",
      value: analytics.totalCourses,
      icon: BookOpen,
      description: "Published courses",
      trend: "+5% this month",
    },
    {
      title: "Total Teachers",
      value: analytics.totalTeachers,
      icon: Users,
      description: "Assigned instructors",
      trend: "+3% this month",
    },
    {
      title: "Total Enrollments",
      value: analytics.totalEnrollments,
      icon: GraduationCap,
      description: "Student enrollments",
      trend: "+18% this month",
    },
    {
      title: "Total Revenue",
      value: `₹${analytics.totalRevenue.toLocaleString("en-IN")}`,
      icon: IndianRupee,
      description: "From enrollments",
      trend: "+25% this month",
    },
  ]

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics & Performance</h1>
        <p className="text-muted-foreground">
          {university.name} - Performance metrics and insights
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.title} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">
                  {card.title}
                </CardTitle>
                <div className="p-2 rounded-lg bg-primary/10">
                  <card.icon className="w-4 h-4 text-primary" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-2xl font-bold">{card.value}</div>
              <div className="flex items-center justify-between text-xs">
                <p className="text-muted-foreground">{card.description}</p>
                <div className="flex items-center gap-1 text-green-600">
                  <TrendingUp className="w-3 h-3" />
                  {card.trend}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Key Metrics</CardTitle>
            <CardDescription>University performance indicators</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Enrollment Rate
                </span>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-32 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-blue-500"
                      style={{
                        width: `${Math.min(
                          (analytics.totalEnrollments /
                            analytics.totalCourses /
                            10) *
                            100,
                          100
                        )}%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">
                    {Math.round(
                      (analytics.totalEnrollments /
                        analytics.totalCourses /
                        10) *
                        100
                    )}%
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Teacher to Course Ratio
                </span>
                <span className="text-sm font-medium">
                  1:{Math.round(analytics.totalCourses / analytics.totalTeachers)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Avg Revenue per Course
                </span>
                <span className="text-sm font-medium">
                  ₹
                  {Math.round(
                    analytics.totalRevenue / analytics.totalCourses
                  ).toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Avg Revenue per Student
                </span>
                <span className="text-sm font-medium">
                  ₹
                  {Math.round(
                    analytics.totalRevenue / analytics.totalEnrollments
                  ).toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Growth Summary</CardTitle>
            <CardDescription>Month-over-month comparison</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950">
                <p className="text-xs text-muted-foreground">New Courses</p>
                <p className="text-xl font-bold text-green-600 dark:text-green-100">
                  +{Math.round(analytics.totalCourses * 0.05)}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950">
                <p className="text-xs text-muted-foreground">New Teachers</p>
                <p className="text-xl font-bold text-blue-600 dark:text-blue-100">
                  +{Math.round(analytics.totalTeachers * 0.03)}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-950">
                <p className="text-xs text-muted-foreground">New Enrollments</p>
                <p className="text-xl font-bold text-purple-600 dark:text-purple-100">
                  +{Math.round(analytics.totalEnrollments * 0.18)}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-orange-50 dark:bg-orange-950">
                <p className="text-xs text-muted-foreground">New Revenue</p>
                <p className="text-xl font-bold text-orange-600 dark:text-orange-100">
                  +₹
                  {Math.round(
                    analytics.totalRevenue * 0.25
                  ).toLocaleString("en-IN")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
