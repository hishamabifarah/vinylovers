"use client"

import type React from "react"

import type { VinylData } from "@/lib/types"
import { MoreHorizontal, Trash2, Edit2 } from "lucide-react"
import { useState } from "react"
import { Button } from "../ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import DeleteVinylDialog from "./DeleteVinylDialog"
import { useRouter } from "next/navigation"

interface PostMoreButtonProps {
  vinyl: VinylData
  className?: string
}

export default function VinylMoreButton({ vinyl, className }: PostMoreButtonProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  // Handle closing the dropdown when an action is selected
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent event bubbling
    setIsOpen(false) // Close the dropdown
    setShowDeleteDialog(true) // Open the delete dialog
  }

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent event bubbling
    setIsOpen(false) // Close the dropdown
    router.push(`/vinyls/edit-vinyl/${vinyl.id}`)
  }

  // Handle dialog close with proper cleanup
  const handleDialogClose = () => {
    setShowDeleteDialog(false)

    // Ensure the page is interactive after dialog closes
    setTimeout(() => {
      document.body.style.pointerEvents = ""
      document.body.style.overflow = ""
    }, 100)
  }

  return (
    <>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            className={className}
            onClick={(e) => {
              e.stopPropagation() // Prevent event bubbling
            }}
          >
            <MoreHorizontal className="size-5 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent onClick={(e) => e.stopPropagation()}>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()} onClick={handleDeleteClick}>
            <span className="flex items-center gap-3 text-destructive">
              <Trash2 className="size-4" />
              <span className="text-primary">Delete</span>
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()} onClick={handleEditClick}>
            <span className="flex items-center gap-3">
              <Edit2 className="size-4" />
              <span className="">Edit</span>
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteVinylDialog vinyl={vinyl} open={showDeleteDialog} onClose={handleDialogClose} />
    </>
  )
}

