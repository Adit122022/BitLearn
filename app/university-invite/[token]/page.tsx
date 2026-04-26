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

  // Find the invitation by token
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

  // If user is logged in, accept the invite directly
  if (session?.user?.id) {
    if (session.user.email !== invitedEmail) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-muted/50 p-4">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle className="text-destructive">Email Mismatch</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-4">
                You're logged in as <strong>{session.user.email}</strong>, but this invitation is for <strong>{invitedEmail}</strong>.
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                Please log out and log in with the correct email to accept this invitation.
              </p>
              <Button onClick={() => window.location.href = "/api/auth/signout"} className="w-full">
                Sign Out
              </Button>
            </CardContent>
          </Card>
        </div>
      )
    }

    // Accept the invite
    await Promise.all([
      prisma.universityTeacher.upsert({
        where: { userId_universityId: { userId: session.user.id, universityId } },
        create: { userId: session.user.id, universityId },
        update: {},
      }),
      prisma.user.update({
        where: { id: session.user.id },
        data: { role: "TEACHER" },
      }),
      prisma.verification.delete({ where: { id: verification.id } }),
    ])

    redirect(`/university/dashboard?invited=true`)
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
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => window.history.back()} className="flex-1">
                Decline
              </Button>
              <form action={async () => {
                "use server"
                const verif = await prisma.verification.findFirst({
                  where: {
                    value: p.token,
                    identifier: { startsWith: "university-invite:" },
                  },
                })
                if (!verif) return
                const [_, uniId, email] = verif.identifier.split(":")

                // Create a temporary pending verification so user can complete signup
                await prisma.verification.create({
                  data: {
                    identifier: `pending-teacher-invite:${uniId}:${email}`,
                    value: p.token,
                    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                  },
                })

                redirect(`/login?invite=${p.token}&email=${encodeURIComponent(email)}`)
              }} className="flex-1">
                <Button className="w-full">
                  Accept & Sign In
                </Button>
              </form>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
