import { Skeleton } from "@/components/ui/skeleton"

export default function ClassroomLoading() {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto">
        <header className="h-16 flex items-center px-6 border-b shrink-0 bg-card">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-5 w-64 ml-4" />
        </header>
        <div className="p-6">
          <Skeleton className="aspect-video w-full max-w-5xl mx-auto rounded-lg" />
          <div className="max-w-5xl mx-auto mt-8 space-y-3">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      </main>
      <aside className="w-80 border-l bg-card shrink-0 h-full flex-col hidden lg:flex">
        <div className="p-4 border-b">
          <Skeleton className="h-6 w-40" />
        </div>
        <div className="p-4 space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-14 rounded-lg" />
          ))}
        </div>
      </aside>
    </div>
  )
}
