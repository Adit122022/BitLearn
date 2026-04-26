"use client"

import * as React from "react"
import { UserPlus, Trash2, Search, Clock, CheckCircle2, Mail } from "lucide-react"
import { toast } from "sonner"
import {
  getMyUniversity,
  getUniversityTeachers,
  removeTeacherFromUniversity,
  getAllUsersForInvite,
} from "@/app/actions/university-actions"
import { sendUniversityInvite, sendUniversityInviteByEmail } from "@/app/actions/notification-actions"
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

type AvailableUser = {
  id: string
  name: string
  email: string
  image: string | null
  role: string
}

export default function UniversityTeachersPage() {
  const [universityId, setUniversityId] = React.useState<string>("")
  const [teachers, setTeachers] = React.useState<Teacher[]>([])
  const [available, setAvailable] = React.useState<AvailableUser[]>([])
  const [loading, setLoading] = React.useState(true)
  const [search, setSearch] = React.useState("")
  const [inviteOpen, setInviteOpen] = React.useState(false)
  const [inviteTab, setInviteTab] = React.useState<"existing" | "email">("email")
  const [selectedUser, setSelectedUser] = React.useState("")
  const [inviteEmail, setInviteEmail] = React.useState("")
  const [subject, setSubject] = React.useState("")
  const [sending, setSending] = React.useState(false)
  const [userSearch, setUserSearch] = React.useState("")

  React.useEffect(() => {
    load()
  }, [])

  async function load() {
    try {
      const uni = await getMyUniversity()
      setUniversityId(uni.id)
      const [t, a] = await Promise.all([
        getUniversityTeachers(uni.id),
        getAllUsersForInvite(),
      ])
      setTeachers(t as any)
      setAvailable(a as any)
    } catch (e: any) {
      toast.error(e.message ?? "Failed to load")
    } finally {
      setLoading(false)
    }
  }

  async function handleSendInvite() {
    setSending(true)
    try {
      if (inviteTab === "email") {
        if (!inviteEmail) {
          toast.error("Please enter an email address")
          return
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(inviteEmail)) {
          toast.error("Please enter a valid email address")
          return
        }
        await sendUniversityInviteByEmail(universityId, inviteEmail, subject || undefined)
        toast.success("Invitation sent! They'll receive it at " + inviteEmail)
      } else {
        if (!selectedUser) {
          toast.error("Please select a user")
          return
        }
        await sendUniversityInvite(universityId, selectedUser, subject || undefined)
        toast.success("Invitation sent! The user will see it in their inbox.")
      }
      setInviteOpen(false)
      setSelectedUser("")
      setInviteEmail("")
      setSubject("")
      setUserSearch("")
    } catch (e: any) {
      toast.error(e.message ?? "Failed to send invite")
    } finally {
      setSending(false)
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
      (u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.email.toLowerCase().includes(userSearch.toLowerCase())) &&
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
            Send invitations to users and teachers to join your university
          </p>
        </div>
        <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="size-4" />
              Invite Teacher
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Invite a Teacher</DialogTitle>
              <DialogDescription>
                Send an invitation to a teacher by email or select from existing users
              </DialogDescription>
            </DialogHeader>

            <div className="flex gap-2 border-b">
              <button
                onClick={() => setInviteTab("email")}
                className={`flex-1 py-2 px-4 text-sm font-medium border-b-2 transition-colors ${inviteTab === "email"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
              >
                <Mail className="w-4 h-4 inline mr-2" />
                By Email
              </button>
              <button
                onClick={() => setInviteTab("existing")}
                className={`flex-1 py-2 px-4 text-sm font-medium border-b-2 transition-colors ${inviteTab === "existing"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
              >
                <Search className="w-4 h-4 inline mr-2" />
                Existing Users
              </button>
            </div>

            <div className="flex flex-col gap-4 py-4">
              {inviteTab === "email" ? (
                <>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="teacher@example.com"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      They'll receive an email with a link to accept the invitation
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex flex-col gap-2">
                    <Label>Search Users</Label>
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by name or email..."
                        className="pl-8"
                        value={userSearch}
                        onChange={(e) => setUserSearch(e.target.value)}
                      />
                    </div>
                    <div className="max-h-48 overflow-y-auto flex flex-col gap-1 border rounded-md p-2">
                      {filteredAvailable.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          No users found
                        </p>
                      ) : (
                        filteredAvailable.map((u) => (
                          <button
                            key={u.id}
                            type="button"
                            onClick={() => setSelectedUser(u.id)}
                            className={`flex items-center gap-2 p-2 rounded text-left hover:bg-muted transition-colors ${selectedUser === u.id ? "bg-muted" : ""
                              }`}
                          >
                            <Avatar className="size-7">
                              <AvatarImage src={u.image ?? ""} />
                              <AvatarFallback className="text-xs">{u.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium">{u.name}</p>
                              <p className="text-xs text-muted-foreground">{u.email}</p>
                            </div>
                            <Badge variant="outline" className="text-xs shrink-0">
                              {u.role}
                            </Badge>
                            {selectedUser === u.id && (
                              <CheckCircle2 className="size-4 text-primary shrink-0" />
                            )}
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}

              <div className="flex flex-col gap-2">
                <Label htmlFor="subject">Subject / Department (optional)</Label>
                <Input
                  id="subject"
                  placeholder="e.g. Computer Science, Mathematics"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setInviteOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleSendInvite}
                disabled={(inviteTab === "email" ? !inviteEmail : !selectedUser) || sending}
              >
                {sending ? "Sending..." : "Send Invitation"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Invite flow info */}
      <div className="flex items-start gap-2 p-3 bg-blue-500/5 border border-blue-500/20 rounded-lg text-sm text-blue-700 dark:text-blue-400">
        <Clock className="size-4 shrink-0 mt-0.5" />
        <p>
          Invitations are sent to the user's inbox. Once they accept, they'll appear here as a member of your university.
        </p>
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
              {search ? "No teachers match your search." : "No teachers have joined yet. Send invitations above."}
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
                        This will remove them from your university. Their courses and account will not be affected.
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
