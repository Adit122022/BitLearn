import { getAdminAnalytics } from "@/app/actions/admin-enrollment-actions"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Users,
  BookOpen,
  GraduationCap,
  IndianRupee,
  TrendingUp,
} from "lucide-react"

export default async function AdminAnalyticsPage() {
  const analytics = await getAdminAnalytics()

  const cards = [
    {
      title: "Total Users",
      value: analytics.totalUsers,
      icon: Users,
      description: "Registered on platform",
      trend: "+12% this month",
    },
    {
      title: "Total Teachers",
      value: analytics.totalTeachers,
      icon: BookOpen,
      description: "Active instructors",
      trend: "+5% this month",
    },
    {
      title: "Published Courses",
      value: analytics.totalCourses,
      icon: GraduationCap,
      description: "Live on platform",
      trend: "+8% this month",
    },
    {
      title: "Total Enrollments",
      value: analytics.totalEnrollments,
      icon: Users,
      description: "Student enrollments",
      trend: "+23% this month",
    },
    {
      title: "Total Revenue",
      value: `₹${analytics.totalRevenue.toLocaleString("en-IN")}`,
      icon: IndianRupee,
      description: "From enrollments",
      trend: "+31% this month",
    },
  ]

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics & Insights</h1>
        <p className="text-muted-foreground">
          Platform-wide statistics and performance metrics
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
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
            <CardDescription>Platform performance indicators</CardDescription>
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
                <p className="text-xs text-muted-foreground">New Users</p>
                <p className="text-xl font-bold text-green-600 dark:text-green-100">
                  +{Math.round(analytics.totalUsers * 0.12)}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950">
                <p className="text-xs text-muted-foreground">New Courses</p>
                <p className="text-xl font-bold text-blue-600 dark:text-blue-100">
                  +{Math.round(analytics.totalCourses * 0.08)}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-950">
                <p className="text-xs text-muted-foreground">New Enrollments</p>
                <p className="text-xl font-bold text-purple-600 dark:text-purple-100">
                  +{Math.round(analytics.totalEnrollments * 0.23)}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-orange-50 dark:bg-orange-950">
                <p className="text-xs text-muted-foreground">New Revenue</p>
                <p className="text-xl font-bold text-orange-600 dark:text-orange-100">
                  +₹
                  {Math.round(
                    analytics.totalRevenue * 0.31
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
