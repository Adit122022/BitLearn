import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect, notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, CheckCircle2 } from "lucide-react"

export default async function UniversityInvitePage({ params }: { params: Promise<{ token: string }> }) {
  const p = await params
  const session = await auth.api.getSession({ headers: await headers() })

  // Find the invitation by token (Read-Only)
  const verification = await prisma.verification.findFirst({
    where: {
      value: p.token,
      identifier: { startsWith: "university-invite:" },
      expiresAt: { gt: new Date() },
    },
  })

  if (!verification) {
    notFound()
  }

  // Parse the identifier to get universityId and email
  const [_, universityId, invitedEmail] = verification.identifier.split(":")

  const university = await prisma.university.findUnique({
    where: { id: universityId },
    select: { id: true, name: true, logo: true, description: true },
  })

  if (!university) {
    notFound()
  }

  const isLoggedIn = !!session?.user?.id;
  const isEmailMatch = session?.user?.email === invitedEmail;

  // Server Action to accept invite
  async function acceptInvite() {
    "use server"
    
    // Verify session again in action
    const currentSession = await auth.api.getSession({ headers: await headers() })
    if (!currentSession?.user?.id) throw new Error("Not logged in")
    if (currentSession.user.email !== invitedEmail) throw new Error("Email mismatch")

    // Accept the invite
    await Promise.all([
      prisma.universityTeacher.upsert({
        where: { userId_universityId: { userId: currentSession.user.id, universityId } },
        create: { userId: currentSession.user.id, universityId },
        update: {},
      }),
      prisma.user.update({
        where: { id: currentSession.user.id },
        data: { role: "TEACHER" },
      }),
      prisma.verification.delete({ where: { id: verification!.id } }),
    ])

    redirect(`/login?accepted=true`)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50 p-4">
      <Card className="max-w-2xl w-full">
        <CardHeader className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <CardTitle className="text-2xl">University Teacher Invitation</CardTitle>
              <p className="text-sm text-muted-foreground">
                You've been invited to teach at {university.name}
              </p>
            </div>
            {university.logo && (
              <img src={university.logo} alt={university.name} className="w-12 h-12 rounded-lg object-cover" />
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm text-blue-900 dark:text-blue-100">{university.name}</p>
                {university.description && (
                  <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">{university.description}</p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold">What happens next?</h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-3 text-sm">
                <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                <span>You'll become a teacher at <strong>{university.name}</strong></span>
              </li>
              <li className="flex items-start gap-3 text-sm">
                <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                <span>Get access to the university portal and course management dashboard</span>
              </li>
              <li className="flex items-start gap-3 text-sm">
                <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                <span>A <Badge variant="secondary" className="ml-1 text-xs">University Teacher</Badge> badge in your profile</span>
              </li>
              <li className="flex items-start gap-3 text-sm">
                <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                <span>Manage and teach courses created by {university.name}</span>
              </li>
            </ul>
          </div>

          <div className="space-y-3 pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              Invitation sent to: <strong>{invitedEmail}</strong>
            </p>
            
            {!isLoggedIn ? (
               <div className="rounded-md bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-4 mb-4">
                 <p className="text-sm text-amber-800 dark:text-amber-200 mb-3">
                   You must be logged in to accept this invitation.
                 </p>
                 <form action={async () => {
                   "use server"
                   redirect("/login")
                 }}>
                   <Button className="w-full" variant="outline">Sign In to Accept</Button>
                 </form>
               </div>
            ) : !isEmailMatch ? (
               <div className="rounded-md bg-destructive/10 border border-destructive/20 p-4 mb-4">
                 <p className="text-sm text-destructive font-medium mb-1">Email Mismatch</p>
                 <p className="text-sm text-destructive/80 mb-3">
                   You are logged in as <strong>{session?.user?.email}</strong>, but this invitation is for <strong>{invitedEmail}</strong>.
                 </p>
                 <form action={async () => {
                   "use server"
                   // Ideally redirect to logout, but we can't easily logout server-side without API route,
                   // so we redirect to client signout
                   redirect("/api/auth/signout")
                 }}>
                   <Button className="w-full" variant="destructive">Sign Out</Button>
                 </form>
               </div>
            ) : (
              <div className="flex gap-3 mt-4">
                <form action={acceptInvite} className="flex-1">
                  <Button className="w-full" size="lg">
                    Accept Invitation
                  </Button>
                </form>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
