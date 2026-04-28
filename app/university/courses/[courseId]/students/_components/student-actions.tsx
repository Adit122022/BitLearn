"use client"

import { useState } from "react"
import { removeStudentFromUniversityCourse } from "@/app/actions/admin-enrollment-actions"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Trash2, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface UniversityCourseStudentActionsProps {
  enrollmentId: string
  universityId: string
  studentName: string
}

export default function UniversityCourseStudentActions({
  enrollmentId,
  universityId,
  studentName,
}: UniversityCourseStudentActionsProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleDelete = async () => {
    try {
      setIsLoading(true)
      await removeStudentFromUniversityCourse(enrollmentId, universityId)
      toast.success(`${studentName} has been removed from the course`)
    } catch (error: any) {
      toast.error(error.message || "Failed to remove student")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Trash2 className="h-4 w-4 mr-1" />
              Remove
            </>
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove Student from Course?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to remove <strong>{studentName}</strong> from
            this course? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex gap-3 justify-end">
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Remove
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}
