import { DataTable } from "@/components/sidebar/data-table"
import { ChartAreaInteractive } from "@/components/sidebar/chart-area-interactive"
import { SectionCards } from "@/components/sidebar/section-cards"
import { getAdminStats, getEnrollmentTrend, getRecentCourses } from "@/app/actions/admin-stats-actions"

export default async function AdminIndexPage() {
  const [stats, trend, courses] = await Promise.all([
    getAdminStats(),
    getEnrollmentTrend(90),
    getRecentCourses(),
  ])

  return (
    <>
      <SectionCards stats={stats} />
      <div className="px-4 lg:px-6">
        <ChartAreaInteractive data={trend} />
      </div>
      <DataTable data={courses} />
    </>
  )
}
