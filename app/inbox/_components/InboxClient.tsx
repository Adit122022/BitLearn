"use client"

import { useState, useTransition } from "react"
import { toast } from "sonner"
import { Bell, Check, X, Building2, BookOpen, Inbox } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card"
import {
  acceptUniversityInvite,
  rejectNotification,
  markAsRead,
  markAllAsRead,
} from "@/app/actions/notification-actions"
import { useRouter } from "next/navigation"

type Notification = {
  id: string
  type: string
  status: string
  title: string
  message: string | null
  createdAt: Date
  sender: { id: string; name: string; image: string | null } | null
  university: { id: string; name: string; logo: string | null } | null
  course: { id: string; title: string; slug: string; imageUrl: string } | null
}

const TAB_OPTIONS = ["All", "Pending", "Accepted", "Rejected", "Read"] as const
type Tab = (typeof TAB_OPTIONS)[number]

const statusColor: Record<string, string> = {
  PENDING: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  ACCEPTED: "bg-green-500/10 text-green-600 border-green-500/20",
  REJECTED: "bg-red-500/10 text-red-600 border-red-500/20",
  READ: "bg-muted text-muted-foreground border-border",
}

function timeAgo(date: Date) {
  const diff = Date.now() - new Date(date).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "just now"
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export function InboxClient({ notifications }: { notifications: Notification[] }) {
  const [activeTab, setActiveTab] = useState<Tab>("All")
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const filtered = notifications.filter((n) => {
    if (activeTab === "All") return true
    return n.status === activeTab.toUpperCase()
  })

  const pendingCount = notifications.filter((n) => n.status === "PENDING").length

  function handleAccept(id: string, type: string) {
    startTransition(async () => {
      try {
        if (type === "UNIVERSITY_INVITE") {
          await acceptUniversityInvite(id)
          toast.success("Invitation accepted! You are now part of the university.")
        } else {
          await markAsRead(id)
          toast.success("Marked as read")
        }
        router.refresh()
      } catch (e: any) {
        toast.error(e.message ?? "Action failed")
      }
    })
  }

  function handleReject(id: string) {
    startTransition(async () => {
      try {
        await rejectNotification(id)
        toast.success("Notification dismissed")
        router.refresh()
      } catch (e: any) {
        toast.error(e.message ?? "Action failed")
      }
    })
  }

  function handleMarkAllRead() {
    startTransition(async () => {
      try {
        await markAllAsRead()
        toast.success("All notifications marked as read")
        router.refresh()
      } catch (e: any) {
        toast.error(e.message ?? "Action failed")
      }
    })
  }

  return (
    <div className="flex flex-col gap-6 p-4 lg:p-6 max-w-3xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Inbox className="size-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold">Inbox</h1>
            <p className="text-sm text-muted-foreground">
              {pendingCount > 0 ? `${pendingCount} pending action${pendingCount > 1 ? "s" : ""}` : "All caught up"}
            </p>
          </div>
          {pendingCount > 0 && (
            <Badge variant="destructive" className="rounded-full">
              {pendingCount}
            </Badge>
          )}
        </div>
        {pendingCount > 0 && (
          <Button variant="outline" size="sm" onClick={handleMarkAllRead} disabled={isPending}>
            Mark all read
          </Button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-muted p-1 rounded-lg w-fit">
        {TAB_OPTIONS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              activeTab === tab
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab}
            {tab === "Pending" && pendingCount > 0 && (
              <span className="ml-1.5 bg-primary text-primary-foreground text-xs rounded-full px-1.5 py-0.5">
                {pendingCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Notifications list */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3 text-muted-foreground">
          <Bell className="size-12 opacity-20" />
          <p className="text-sm">No notifications here</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((n) => (
            <Card
              key={n.id}
              className={`transition-all ${n.status === "PENDING" ? "border-primary/30 shadow-sm" : ""}`}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div className="p-2 bg-muted rounded-lg shrink-0 mt-0.5">
                    {n.type === "UNIVERSITY_INVITE" ? (
                      <Building2 className="size-4 text-primary" />
                    ) : n.type === "COURSE_ASSIGNMENT" ? (
                      <BookOpen className="size-4 text-blue-500" />
                    ) : (
                      <Bell className="size-4 text-muted-foreground" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-medium">{n.title}</p>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full border font-medium ${statusColor[n.status] ?? ""}`}
                      >
                        {n.status.charAt(0) + n.status.slice(1).toLowerCase()}
                      </span>
                    </div>
                    {n.message && (
                      <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                        {n.message}
                      </p>
                    )}

                    {/* Meta */}
                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                      {n.sender && (
                        <div className="flex items-center gap-1.5">
                          <Avatar className="size-4">
                            <AvatarImage src={n.sender.image ?? ""} />
                            <AvatarFallback className="text-[10px]">
                              {n.sender.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs text-muted-foreground">{n.sender.name}</span>
                        </div>
                      )}
                      {n.university && (
                        <span className="text-xs text-muted-foreground">
                          {n.university.name}
                        </span>
                      )}
                      <span className="text-xs text-muted-foreground ml-auto">
                        {timeAgo(n.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>

              {/* Actions */}
              {n.status === "PENDING" && (
                <CardContent className="pt-0 pb-3">
                  <div className="flex gap-2 ml-11">
                    {n.type === "UNIVERSITY_INVITE" ? (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleAccept(n.id, n.type)}
                          disabled={isPending}
                          className="gap-1.5"
                        >
                          <Check className="size-3.5" />
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleReject(n.id)}
                          disabled={isPending}
                          className="gap-1.5 text-destructive hover:text-destructive"
                        >
                          <X className="size-3.5" />
                          Decline
                        </Button>
                      </>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAccept(n.id, n.type)}
                        disabled={isPending}
                      >
                        Mark as read
                      </Button>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
