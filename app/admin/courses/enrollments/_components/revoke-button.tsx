"use client"

import { useState } from "react"
import { removeStudentFromCourse } from "@/app/actions/admin-enrollment-actions"
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
import { Shield, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface RevokeEnrollmentButtonProps {
  enrollmentId: string
  courseId: string
  studentName: string
}

export default function RevokeEnrollmentButton({
  enrollmentId,
  courseId,
  studentName,
}: RevokeEnrollmentButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleRevoke = async () => {
    try {
      setIsLoading(true)
      await removeStudentFromCourse(enrollmentId, courseId)
      toast.success(`${studentName}'s access has been revoked`)
    } catch (error: any) {
      toast.error(error.message || "Failed to revoke access")
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
              <Shield className="h-4 w-4 mr-1" />
              Revoke
            </>
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Revoke Access?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to revoke <strong>{studentName}</strong>'s
            access to this course? They will no longer be able to view course
            materials.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex gap-3 justify-end">
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleRevoke}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Revoke Access
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}
