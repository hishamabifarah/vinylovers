"use client"

import type React from "react"

import type { VinylData } from "@/lib/types"
import LoadingButton from "../LoadingButton"
import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { useDeleteVinylMutation } from "./mutations"

interface DeletePostDialogProps {
  vinyl: VinylData
  open: boolean
  onClose: () => void
}

export default function DeleteVinylDialog({ vinyl, open, onClose }: DeletePostDialogProps) {
  const mutation = useDeleteVinylMutation()

  // Improved open change handler
  function handleOpenChange(open: boolean) {
    if (!open && !mutation.isPending) {
      // Only close if not in the middle of a deletion
      onClose()

      // Ensure the body is interactive after dialog closes
      setTimeout(() => {
        document.body.style.pointerEvents = ""
        document.body.style.overflow = ""
      }, 100)
    }
  }

  // Handle delete with proper cleanup
  const handleDelete = () => {
    mutation.mutate(vinyl.id, {
      onSuccess: () => {
        onClose()
        // Ensure the body is interactive after successful deletion
        setTimeout(() => {
          document.body.style.pointerEvents = ""
          document.body.style.overflow = ""
        }, 100)
      },
      onError: () => {
        // Even on error, ensure we clean up
        onClose()
        setTimeout(() => {
          document.body.style.pointerEvents = ""
          document.body.style.overflow = ""
        }, 100)
      },
    })
  }

  // Handle cancel with proper cleanup
  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent event bubbling
    onClose()

    // Ensure the body is interactive after cancellation
    setTimeout(() => {
      document.body.style.pointerEvents = ""
      document.body.style.overflow = ""
    }, 100)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>Delete vinyl?</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this Vinyl? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <LoadingButton variant="destructive" onClick={handleDelete} loading={mutation.isPending}>
            Delete
          </LoadingButton>
          <Button variant="outline" onClick={handleCancel} disabled={mutation.isPending}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

