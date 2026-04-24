"use client"

import * as React from "react"
import { toast } from "sonner"
import { submitUniversityRequest } from "@/app/actions/university-request-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, CheckCircle2, Loader2 } from "lucide-react"

export default function RequestUniversityPage() {
  const [submitting, setSubmitting] = React.useState(false)
  const [done, setDone] = React.useState(false)
  const [form, setForm] = React.useState({
    name: "",
    email: "",
    website: "",
    description: "",
    contactName: "",
    contactEmail: "",
    message: "",
  })

  function update(key: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.email || !form.contactName || !form.contactEmail) {
      toast.error("Please fill in all required fields")
      return
    }
    setSubmitting(true)
    try {
      await submitUniversityRequest({
        name: form.name,
        email: form.email,
        website: form.website || undefined,
        description: form.description || undefined,
        contactName: form.contactName,
        contactEmail: form.contactEmail,
        message: form.message || undefined,
      })
      setDone(true)
    } catch (e: any) {
      toast.error(e.message ?? "Failed to submit request")
    } finally {
      setSubmitting(false)
    }
  }

  if (done) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md">
          <CheckCircle2 className="size-16 text-green-500 mx-auto" />
          <h2 className="text-2xl font-bold">Request Submitted!</h2>
          <p className="text-muted-foreground">
            Your university registration request has been received. Our admin team will review
            it and reach out to you at <strong>{form.contactEmail}</strong> within a few
            business days.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <div className="mb-8 text-center space-y-3">
        <div className="flex justify-center">
          <div className="p-4 rounded-full bg-primary/10">
            <Building2 className="size-10 text-primary" />
          </div>
        </div>
        <h1 className="text-3xl font-bold">Register Your University</h1>
        <p className="text-muted-foreground">
          Submit a request to join BitLearn as a university partner. Once approved, you'll get
          your own admin panel to manage teachers and courses.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>University Information</CardTitle>
            <CardDescription>Tell us about your institution</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label>University Name *</Label>
                <Input
                  placeholder="e.g. IIT Bombay"
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Official Email *</Label>
                <Input
                  type="email"
                  placeholder="admin@university.edu"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Website</Label>
              <Input
                placeholder="https://university.edu"
                value={form.website}
                onChange={(e) => update("website", e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Description</Label>
              <Textarea
                placeholder="Brief description of your university..."
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Contact Person</CardTitle>
            <CardDescription>
              Who should we contact? This person will become the university admin if approved.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label>Contact Name *</Label>
                <Input
                  placeholder="Full name"
                  value={form.contactName}
                  onChange={(e) => update("contactName", e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Contact Email *</Label>
                <Input
                  type="email"
                  placeholder="you@university.edu"
                  value={form.contactEmail}
                  onChange={(e) => update("contactEmail", e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Additional Message</Label>
              <Textarea
                placeholder="Anything else you'd like to share with the admin team..."
                value={form.message}
                onChange={(e) => update("message", e.target.value)}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Button type="submit" className="w-full mt-6" size="lg" disabled={submitting}>
          {submitting && <Loader2 className="size-4 animate-spin mr-2" />}
          {submitting ? "Submitting..." : "Submit Registration Request"}
        </Button>
      </form>
    </div>
  )
}
