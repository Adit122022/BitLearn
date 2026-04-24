"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { markLessonComplete, markLessonIncomplete } from "@/app/actions/lesson-progress-actions"
import { CheckCircle, Circle, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface Props {
  lessonId: string
  initialCompleted: boolean
}

export function MarkCompleteButton({ lessonId, initialCompleted }: Props) {
  const [completed, setCompleted] = useState(initialCompleted)
  const [loading, setLoading] = useState(false)

  async function toggle() {
    setLoading(true)
    try {
      if (completed) {
        await markLessonIncomplete(lessonId)
        setCompleted(false)
        toast.success("Marked as incomplete")
      } else {
        await markLessonComplete(lessonId)
        setCompleted(true)
        toast.success("Lesson completed!")
      }
    } catch {
      toast.error("Failed to update progress")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant={completed ? "default" : "outline"}
      size="sm"
      onClick={toggle}
      disabled={loading}
      className="gap-2"
    >
      {loading ? (
        <Loader2 className="size-4 animate-spin" />
      ) : completed ? (
        <CheckCircle className="size-4" />
      ) : (
        <Circle className="size-4" />
      )}
      {completed ? "Completed" : "Mark as Complete"}
    </Button>
  )
}
