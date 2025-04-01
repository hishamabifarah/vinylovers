"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"
import { MoreVertical, Trash2 } from "lucide-react"
import { useState } from "react"
import { useChatContext } from "stream-chat-react"
import { useSession } from "@/app/(main)/SessionProvider";

export default function ChatOptions() {
  const { channel, client } = useChatContext()
  const { user } = useSession()
  const { toast } = useToast()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  if (!channel) return null

  const handleDeleteClick = async () => {
    // Check if the current user is a channel admin
    const currentMember = channel.state.members[user!.id]
    const isChannelAdmin = currentMember?.role === "channel_admin" || channel.data?.created_by_id === user!.id

    if (isChannelAdmin) {
      setShowDeleteDialog(true)
    } else {
      // Show toast notification if user is not the channel admin
      toast({
        title: "Cannot delete chat",
        description: "Only the creator of the conversation can delete it.",
        variant: "destructive",
      })
    }
  }

  const handleConfirmDelete = async () => {
    try {
      setIsDeleting(true)

      // Delete the channel
      await channel.delete()

      toast({
        title: "Chat deleted",
        description: "The conversation has been deleted successfully.",
      })

      // Refresh the channel list
      window.location.href = "/chat"
    } catch (error) {
      console.error("Error deleting channel:", error)
      toast({
        title: "Error",
        description: "Failed to delete the conversation. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={handleDeleteClick}>
            <Trash2 className="mr-2 h-4 w-4 " />
            <span className="">Delete Conversation</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Conversation</DialogTitle>
            <DialogDescription>
              This will permanently delete the conversation for all participants. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete Conversation"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

