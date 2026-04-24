"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { authClient } from "@/lib/auth-client"
import { User, Mail, Shield, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { deleteMyAccount } from "@/app/actions/user-actions"
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

export default function ProfilePage() {
  const { data: session, isPending } = authClient.useSession()
  const router = useRouter()

  const [name, setName] = React.useState("")
  const [saving, setSaving] = React.useState(false)
  const [deleting, setDeleting] = React.useState(false)

  React.useEffect(() => {
    if (session?.user) {
      setName(session.user.name ?? "")
    }
  }, [session])

  if (isPending) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!session) {
    return <div className="p-8 text-center text-destructive">Failed to load session.</div>
  }

  const { user } = session
  const initials = (user.name ?? "?").substring(0, 2).toUpperCase()
  const role = (user as any).role ?? "STUDENT"
  const nameChanged = name.trim() !== (user.name ?? "").trim()

  async function handleSave() {
    if (!nameChanged || !name.trim()) return
    setSaving(true)
    try {
      await authClient.updateUser({ name: name.trim() })
      toast.success("Profile updated")
    } catch {
      toast.error("Failed to update profile")
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    setDeleting(true)
    try {
      await deleteMyAccount()
      await authClient.signOut()
      router.push("/")
      toast.success("Account deleted")
    } catch {
      toast.error("Failed to delete account")
      setDeleting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sidebar card */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Avatar className="h-24 w-24 border-4 border-background shadow-md">
                  <AvatarImage src={user.image ?? ""} alt={user.name ?? ""} />
                  <AvatarFallback className="text-3xl bg-primary/10 text-primary">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </div>
              <CardTitle>{user.name}</CardTitle>
              <CardDescription>{user.email}</CardDescription>
              <div className="mt-4 flex justify-center">
                <Badge variant="secondary" className="px-4 py-1 text-sm bg-primary/10 text-primary flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  {role}
                </Badge>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Main settings */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your display name.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" /> Full Name
                </label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" /> Email Address
                </label>
                <Input value={user.email ?? ""} disabled />
                <p className="text-xs text-muted-foreground">
                  Email is tied to your sign-in method and cannot be changed here.
                </p>
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4 bg-muted/20">
              <Button
                className="ml-auto"
                onClick={handleSave}
                disabled={!nameChanged || saving}
              >
                {saving && <Loader2 className="size-4 animate-spin mr-2" />}
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Danger Zone</CardTitle>
              <CardDescription>Irreversible account actions.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 border border-destructive/30 rounded-lg">
                <div>
                  <p className="font-medium text-destructive">Delete Account</p>
                  <p className="text-sm text-muted-foreground">
                    Permanently removes your account and all associated data.
                  </p>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" disabled={deleting}>
                      {deleting && <Loader2 className="size-4 animate-spin mr-2" />}
                      Delete Account
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete your account, enrollments, and all your
                        data. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        onClick={handleDelete}
                      >
                        Yes, delete my account
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
