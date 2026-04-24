"use client"

import * as React from "react"
import { toast } from "sonner"
import {
  getAllUniversityRequests,
  approveUniversityRequest,
  rejectUniversityRequest,
} from "@/app/actions/university-request-actions"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
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
} from "@/components/ui/dialog"
import { Building2, Check, X, ExternalLink, Loader2, Globe, Mail, User } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type Req = Awaited<ReturnType<typeof getAllUniversityRequests>>[number]

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  Pending: "secondary",
  Approved: "default",
  Rejected: "destructive",
}

export default function UniversityRequestsPage() {
  const [requests, setRequests] = React.useState<Req[]>([])
  const [loading, setLoading] = React.useState(true)

  const [actionDialog, setActionDialog] = React.useState<{
    type: "approve" | "reject"
    req: Req
  } | null>(null)
  const [adminNote, setAdminNote] = React.useState("")
  const [acting, setActing] = React.useState(false)

  React.useEffect(() => { load() }, [])

  async function load() {
    try {
      setRequests(await getAllUniversityRequests())
    } catch {
      toast.error("Failed to load requests")
    } finally {
      setLoading(false)
    }
  }

  async function handleApprove() {
    if (!actionDialog) return
    setActing(true)
    try {
      const result = await approveUniversityRequest(actionDialog.req.id, adminNote || undefined)
      const msg = result.assignedUser
        ? `Approved! ${result.assignedUser.name} assigned as university admin.`
        : "Approved! No matching account found for contact email — assign an admin manually."
      toast.success(msg)
      setActionDialog(null)
      setAdminNote("")
      load()
    } catch (e: any) {
      toast.error(e.message ?? "Failed to approve")
    } finally {
      setActing(false)
    }
  }

  async function handleReject() {
    if (!actionDialog) return
    setActing(true)
    try {
      await rejectUniversityRequest(actionDialog.req.id, adminNote || undefined)
      toast.success("Request rejected")
      setActionDialog(null)
      setAdminNote("")
      load()
    } catch (e: any) {
      toast.error(e.message ?? "Failed to reject")
    } finally {
      setActing(false)
    }
  }

  const pending = requests.filter((r) => r.status === "Pending")
  const approved = requests.filter((r) => r.status === "Approved")
  const rejected = requests.filter((r) => r.status === "Rejected")

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
      </div>
    )
  }

  function RequestCard({ req }: { req: Req }) {
    return (
      <Card key={req.id}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <Building2 className="size-4 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <CardTitle className="text-base">{req.name}</CardTitle>
                <CardDescription className="text-xs">{req.email}</CardDescription>
              </div>
            </div>
            <Badge variant={statusVariant[req.status]}>{req.status}</Badge>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div className="flex flex-col gap-1 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <User className="size-3.5" />
              <span>{req.contactName} — {req.contactEmail}</span>
            </div>
            {req.website && (
              <div className="flex items-center gap-2">
                <Globe className="size-3.5" />
                <a href={req.website} target="_blank" rel="noopener noreferrer"
                  className="text-primary hover:underline flex items-center gap-1">
                  {req.website} <ExternalLink className="size-3" />
                </a>
              </div>
            )}
          </div>
          {req.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">{req.description}</p>
          )}
          {req.message && (
            <p className="text-sm italic text-muted-foreground border-l-2 pl-3 line-clamp-2">
              "{req.message}"
            </p>
          )}
          {req.adminNote && (
            <p className="text-xs text-muted-foreground bg-muted rounded px-2 py-1">
              Admin note: {req.adminNote}
            </p>
          )}
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-muted-foreground">
              {new Date(req.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
            </span>
            {req.status === "Pending" && (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="text-destructive border-destructive/30 hover:bg-destructive/10"
                  onClick={() => { setActionDialog({ type: "reject", req }); setAdminNote("") }}
                >
                  <X className="size-3.5" /> Reject
                </Button>
                <Button
                  size="sm"
                  onClick={() => { setActionDialog({ type: "approve", req }); setAdminNote("") }}
                >
                  <Check className="size-3.5" /> Approve
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-6 p-4 lg:p-6">
      <div>
        <h1 className="text-2xl font-semibold">University Requests</h1>
        <p className="text-muted-foreground text-sm">
          Review and approve university registration requests
        </p>
      </div>

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">
            Pending {pending.length > 0 && <Badge variant="secondary" className="ml-1.5 h-5 px-1.5 text-xs">{pending.length}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-4">
          {pending.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16 gap-3">
                <Building2 className="size-10 text-muted-foreground" />
                <p className="text-muted-foreground">No pending requests</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {pending.map((r) => <RequestCard key={r.id} req={r} />)}
            </div>
          )}
        </TabsContent>

        <TabsContent value="approved" className="mt-4">
          {approved.length === 0 ? (
            <Card><CardContent className="py-16 text-center text-muted-foreground">No approved requests</CardContent></Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {approved.map((r) => <RequestCard key={r.id} req={r} />)}
            </div>
          )}
        </TabsContent>

        <TabsContent value="rejected" className="mt-4">
          {rejected.length === 0 ? (
            <Card><CardContent className="py-16 text-center text-muted-foreground">No rejected requests</CardContent></Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {rejected.map((r) => <RequestCard key={r.id} req={r} />)}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Approve / Reject dialog */}
      <Dialog open={!!actionDialog} onOpenChange={(o) => !o && setActionDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionDialog?.type === "approve" ? "Approve" : "Reject"} — {actionDialog?.req.name}
            </DialogTitle>
            <DialogDescription>
              {actionDialog?.type === "approve"
                ? "This will create the university and automatically assign the contact person as admin if their email matches an existing account."
                : "The request will be marked as rejected."}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <Label>Admin Note (optional)</Label>
            <Textarea
              placeholder="Add a note for your records..."
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialog(null)}>Cancel</Button>
            <Button
              variant={actionDialog?.type === "reject" ? "destructive" : "default"}
              onClick={actionDialog?.type === "approve" ? handleApprove : handleReject}
              disabled={acting}
            >
              {acting && <Loader2 className="size-4 animate-spin mr-2" />}
              {actionDialog?.type === "approve" ? "Approve & Create" : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
