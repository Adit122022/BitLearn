"use client"

import * as React from "react"
import { UserPlus, Trash2, Search } from "lucide-react"
import { toast } from "sonner"
import {
  getMyUniversity,
  getUniversityTeachers,
  assignTeacherToUniversity,
  removeTeacherFromUniversity,
  getAllTeachersForAssignment,
} from "@/app/actions/university-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

type Teacher = {
  id: string
  userId: string
  subject: string | null
  user: { id: string; name: string; email: string; image: string | null }
}

type AvailableTeacher = { id: string; name: string; email: string; image: string | null }

export default function UniversityTeachersPage() {
  const [universityId, setUniversityId] = React.useState<string>("")
  const [teachers, setTeachers] = React.useState<Teacher[]>([])
  const [available, setAvailable] = React.useState<AvailableTeacher[]>([])
  const [loading, setLoading] = React.useState(true)
  const [search, setSearch] = React.useState("")
  const [assignOpen, setAssignOpen] = React.useState(false)
  const [selectedTeacher, setSelectedTeacher] = React.useState("")
  const [subject, setSubject] = React.useState("")
  const [assigning, setAssigning] = React.useState(false)
  const [teacherSearch, setTeacherSearch] = React.useState("")

  React.useEffect(() => {
    load()
  }, [])

  async function load() {
    try {
      const uni = await getMyUniversity()
      setUniversityId(uni.id)
      const [t, a] = await Promise.all([
        getUniversityTeachers(uni.id),
        getAllTeachersForAssignment(),
      ])
      setTeachers(t as any)
      setAvailable(a as any)
    } catch (e: any) {
      toast.error(e.message ?? "Failed to load")
    } finally {
      setLoading(false)
    }
  }

  async function handleAssign() {
    if (!selectedTeacher) return
    setAssigning(true)
    try {
      await assignTeacherToUniversity(universityId, selectedTeacher, subject || undefined)
      toast.success("Teacher assigned successfully")
      setAssignOpen(false)
      setSelectedTeacher("")
      setSubject("")
      setTeacherSearch("")
      load()
    } catch (e: any) {
      toast.error(e.message ?? "Failed to assign teacher")
    } finally {
      setAssigning(false)
    }
  }

  async function handleRemove(userId: string, name: string) {
    try {
      await removeTeacherFromUniversity(universityId, userId)
      toast.success(`${name} removed from university`)
      load()
    } catch (e: any) {
      toast.error(e.message ?? "Failed to remove teacher")
    }
  }

  const filteredTeachers = teachers.filter(
    (t) =>
      t.user.name.toLowerCase().includes(search.toLowerCase()) ||
      t.user.email.toLowerCase().includes(search.toLowerCase()) ||
      (t.subject ?? "").toLowerCase().includes(search.toLowerCase())
  )

  const filteredAvailable = available.filter(
    (u) =>
      (u.name.toLowerCase().includes(teacherSearch.toLowerCase()) ||
        u.email.toLowerCase().includes(teacherSearch.toLowerCase())) &&
      !teachers.some((t) => t.userId === u.id)
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading teachers...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 p-4 lg:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Teachers</h1>
          <p className="text-muted-foreground text-sm">
            Manage teachers assigned to your university
          </p>
        </div>
        <Dialog open={assignOpen} onOpenChange={setAssignOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="size-4" />
              Assign Teacher
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Assign Teacher</DialogTitle>
              <DialogDescription>
                Select a teacher from the platform to assign to your university.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label>Search Teachers</Label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or email..."
                    className="pl-8"
                    value={teacherSearch}
                    onChange={(e) => setTeacherSearch(e.target.value)}
                  />
                </div>
                <div className="max-h-48 overflow-y-auto flex flex-col gap-1 border rounded-md p-2">
                  {filteredAvailable.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No available teachers found
                    </p>
                  ) : (
                    filteredAvailable.map((u) => (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => setSelectedTeacher(u.id)}
                        className={`flex items-center gap-2 p-2 rounded text-left hover:bg-muted transition-colors ${
                          selectedTeacher === u.id ? "bg-muted" : ""
                        }`}
                      >
                        <Avatar className="size-7">
                          <AvatarImage src={u.image ?? ""} />
                          <AvatarFallback className="text-xs">{u.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{u.name}</p>
                          <p className="text-xs text-muted-foreground">{u.email}</p>
                        </div>
                        {selectedTeacher === u.id && (
                          <Badge className="ml-auto" variant="secondary">
                            Selected
                          </Badge>
                        )}
                      </button>
                    ))
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label>Subject / Department (optional)</Label>
                <Input
                  placeholder="e.g. Computer Science, Mathematics"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAssignOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAssign} disabled={!selectedTeacher || assigning}>
                {assigning ? "Assigning..." : "Assign Teacher"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
        <Input
          placeholder="Filter teachers..."
          className="pl-8"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filteredTeachers.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 gap-3">
            <p className="text-muted-foreground">
              {search ? "No teachers match your search." : "No teachers assigned yet."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {filteredTeachers.map((t) => (
            <Card key={t.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <Avatar className="size-10">
                    <AvatarImage src={t.user.image ?? ""} />
                    <AvatarFallback>{t.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-sm font-medium truncate">
                      {t.user.name}
                    </CardTitle>
                    <CardDescription className="text-xs truncate">
                      {t.user.email}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex items-center justify-between pt-0">
                {t.subject ? (
                  <Badge variant="secondary">{t.subject}</Badge>
                ) : (
                  <span className="text-xs text-muted-foreground">No subject assigned</span>
                )}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="size-8 text-destructive">
                      <Trash2 className="size-3.5" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Remove {t.user.name}?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will remove them from your university. Their courses and account
                        will not be affected.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        onClick={() => handleRemove(t.userId, t.user.name)}
                      >
                        Remove
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
