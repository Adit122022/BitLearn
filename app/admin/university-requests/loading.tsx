import { Skeleton } from "@/components/ui/skeleton"

export default function UniversityRequestsLoading() {
  return (
    <div className="flex flex-col gap-6 p-4 lg:p-6">
      <Skeleton className="h-8 w-56" />
      <Skeleton className="h-10 w-64" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-52 rounded-xl" />
        ))}
      </div>
    </div>
  )
}
