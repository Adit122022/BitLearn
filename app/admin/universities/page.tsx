"use client"

import * as React from "react"
import { Plus, Trash2, UserPlus, ToggleLeft, ToggleRight, Building2 } from "lucide-react"
import { toast } from "sonner"
import {
  createUniversity,
  getAllUniversities,
  assignUniversityAdmin,
  deleteUniversity,
  toggleUniversityStatus,
} from "@/app/actions/university-actions"
import { getAllUsers } from "@/app/actions/user-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type University = Awaited<ReturnType<typeof getAllUniversities>>[number]
type User = { id: string; name: string; email: string; image?: string | null }

export default function UniversitiesAdminPage() {
  const [universities, setUniversities] = React.useState<University[]>([])
  const [users, setUsers] = React.useState<User[]>([])
  const [loading, setLoading] = React.useState(true)

  // Create form state
  const [createOpen, setCreateOpen] = React.useState(false)
  const [creating, setCreating] = React.useState(false)
  const [form, setForm] = React.useState({
    name: "",
    email: "",
    description: "",
    website: "",
  })

  // Assign admin state
  const [assignOpen, setAssignOpen] = React.useState<string | null>(null)
  const [selectedUser, setSelectedUser] = React.useState("")
  const [assigning, setAssigning] = React.useState(false)

  React.useEffect(() => {
    load()
  }, [])

  async function load() {
    try {
      const [unis, allUsers] = await Promise.all([getAllUniversities(), getAllUsers()])
      setUniversities(unis as any)
      setUsers(allUsers.map((u) => ({ id: u.id, name: u.name, email: u.email, image: u.image })))
    } catch {
      toast.error("Failed to load data")
    } finally {
      setLoading(false)
    }
  }

  async function handleCreate() {
    if (!form.name.trim() || !form.email.trim()) {
      toast.error("Name and email are required")
      return
    }
    setCreating(true)
    try {
      await createUniversity(form)
      toast.success("University created")
      setCreateOpen(false)
      setForm({ name: "", email: "", description: "", website: "" })
      load()
    } catch (e: any) {
      toast.error(e.message ?? "Failed to create university")
    } finally {
      setCreating(false)
    }
  }

  async function handleAssignAdmin(universityId: string) {
    if (!selectedUser) return
    setAssigning(true)
    try {
      await assignUniversityAdmin(universityId, selectedUser)
      toast.success("Admin assigned successfully")
      setAssignOpen(null)
      setSelectedUser("")
      load()
    } catch (e: any) {
      toast.error(e.message ?? "Failed to assign admin")
    } finally {
      setAssigning(false)
    }
  }

  async function handleDelete(universityId: string) {
    try {
      await deleteUniversity(universityId)
      toast.success("University deleted")
      load()
    } catch (e: any) {
      toast.error(e.message ?? "Failed to delete university")
    }
  }

  async function handleToggle(universityId: string, current: boolean) {
    try {
      await toggleUniversityStatus(universityId, !current)
      toast.success(`University ${current ? "deactivated" : "activated"}`)
      load()
    } catch {
      toast.error("Failed to update status")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading universities...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 p-4 lg:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Universities</h1>
          <p className="text-muted-foreground text-sm">
            Manage university accounts and their administrators
          </p>
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="size-4" />
              Add University
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create University</DialogTitle>
              <DialogDescription>
                Add a new university to the platform. You can assign an admin after creation.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label>University Name *</Label>
                <Input
                  placeholder="e.g. IIT Bombay"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Official Email *</Label>
                <Input
                  type="email"
                  placeholder="admin@university.edu"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Website</Label>
                <Input
                  placeholder="https://university.edu"
                  value={form.website}
                  onChange={(e) => setForm({ ...form, website: e.target.value })}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Description</Label>
                <Textarea
                  placeholder="Brief description..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCreateOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreate} disabled={creating}>
                {creating ? "Creating..." : "Create University"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {universities.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 gap-3">
            <Building2 className="size-12 text-muted-foreground" />
            <p className="text-muted-foreground">No universities yet. Add the first one.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {universities.map((uni) => (
            <Card key={uni.id} className={!uni.isActive ? "opacity-60" : ""}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-col gap-1">
                    <CardTitle className="text-base leading-tight">{uni.name}</CardTitle>
                    <CardDescription className="text-xs">{uni.email}</CardDescription>
                  </div>
                  <Badge variant={uni.isActive ? "default" : "secondary"}>
                    {uni.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <span>{(uni._count as any).teachers} teachers</span>
                  <span>{(uni._count as any).courses} courses</span>
                </div>

                {/* Admins */}
                <div className="flex flex-col gap-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Admins
                  </p>
                  {(uni.admins as any[]).length === 0 ? (
                    <p className="text-xs text-muted-foreground">No admin assigned</p>
                  ) : (
                    <div className="flex flex-col gap-1">
                      {(uni.admins as any[]).map((a: any) => (
                        <div key={a.id} className="flex items-center gap-2">
                          <Avatar className="size-6">
                            <AvatarImage src={a.user.image ?? ""} />
                            <AvatarFallback className="text-xs">
                              {a.user.name?.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{a.user.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {uni.website && (
                  <a
                    href={uni.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline"
                  >
                    {uni.website}
                  </a>
                )}

                <div className="flex gap-2 flex-wrap">
                  {/* Assign admin */}
                  <Dialog
                    open={assignOpen === uni.id}
                    onOpenChange={(o) => {
                      setAssignOpen(o ? uni.id : null)
                      setSelectedUser("")
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <UserPlus className="size-3.5" />
                        Assign Admin
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Assign University Admin</DialogTitle>
                        <DialogDescription>
                          Select a user to become the admin for {uni.name}.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="flex flex-col gap-2">
                        <Label>Select User</Label>
                        <Select value={selectedUser} onValueChange={setSelectedUser}>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose a user..." />
                          </SelectTrigger>
                          <SelectContent>
                            {users.map((u) => (
                              <SelectItem key={u.id} value={u.id}>
                                {u.name} — {u.email}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setAssignOpen(null)}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={() => handleAssignAdmin(uni.id)}
                          disabled={!selectedUser || assigning}
                        >
                          {assigning ? "Assigning..." : "Assign Admin"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  {/* Toggle active */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggle(uni.id, uni.isActive)}
                  >
                    {uni.isActive ? (
                      <ToggleLeft className="size-3.5" />
                    ) : (
                      <ToggleRight className="size-3.5" />
                    )}
                    {uni.isActive ? "Deactivate" : "Activate"}
                  </Button>

                  {/* Delete */}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="size-3.5" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete {uni.name}?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete the university and all its teacher
                          assignments. Courses linked to it will be unlinked. This cannot be
                          undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          onClick={() => handleDelete(uni.id)}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
