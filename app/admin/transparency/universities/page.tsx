import { getAllUniversities } from "@/app/actions/admin-transparency-actions"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, Users, BookOpen, ShieldAlert } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function UniversitiesTransparencyPage() {
  const universities = await getAllUniversities()

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <div>
        <h1 className="text-3xl font-bold">Universities Overview</h1>
        <p className="text-muted-foreground">
          Complete transparency of all registered universities
        </p>
      </div>

      <div className="grid gap-4">
        {universities.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">
                No universities registered yet.
              </p>
            </CardContent>
          </Card>
        ) : (
          universities.map((uni) => (
            <Card key={uni.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    {uni.logo && (
                      <img
                        src={uni.logo}
                        alt={uni.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <CardTitle>{uni.name}</CardTitle>
                        <Badge
                          variant={uni.isActive ? "default" : "secondary"}
                        >
                          {uni.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{uni.email}</p>
                      {uni.description && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {uni.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <Button variant="outline" asChild>
                    <Link href={`/admin/transparency/universities/${uni.id}`}>
                      View Details
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <BookOpen className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Courses</p>
                      <p className="text-xl font-bold">{uni._count.courses}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                      <Users className="w-4 h-4 text-blue-600 dark:text-blue-100" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Teachers</p>
                      <p className="text-xl font-bold">{uni._count.teachers}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900">
                      <ShieldAlert className="w-4 h-4 text-green-600 dark:text-green-100" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Admins</p>
                      <p className="text-xl font-bold">{uni._count.admins}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
