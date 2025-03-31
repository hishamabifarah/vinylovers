"use client"

import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { useState } from "react"
import { useChannelStateContext, useChatContext } from "stream-chat-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import LoadingButton from "@/components/LoadingButton"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import kyInstance from "@/lib/ky"

interface DeleteChatButtonProps {
  className?: string
}

export default function DeleteChatButton({ className }: DeleteChatButtonProps) {
  const [showDialog, setShowDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const { channel } = useChannelStateContext()
  const { client, setActiveChannel } = useChatContext()
  const { toast } = useToast()
  const router = useRouter()

  // Only show button if user is a channel member
  const currentUserId = client?.userID
  const isChannelMember = currentUserId && channel?.state?.members?.[currentUserId]

  if (!channel || !isChannelMember || !currentUserId) return null

  const handleDeleteChat = async () => {
    if (!channel || !currentUserId) return

    setIsDeleting(true)
    try {
      console.log(`Attempting to delete channel: ${channel.type}:${channel.id}`)

      // Use server-side endpoint to perform hard delete
      const response = await kyInstance
        .post("/api/chat/channels/delete", {
          json: {
            channelId: channel.id,
            channelType: channel.type,
          },
          timeout: 10000, // Increase timeout for potentially slow operations
        })
        .json()

      console.log("Delete response:", response)

      // Clear the active channel
      if (setActiveChannel) {
        setActiveChannel(undefined)
      }

      toast({
        description: "Chat deleted successfully",
      })

      // Redirect to the main chat page
      router.push("/messages")

      // Close the dialog
      setShowDialog(false)
    } catch (error) {
      console.error("Error deleting chat:", error)

      // Try to extract more detailed error information
      let errorMessage = "Failed to delete chat. Please try again."
      try {
        if (error instanceof Response) {
          const errorData = await error.json()
          errorMessage = errorData.details || errorData.error || errorMessage
        } else if (error instanceof Error) {
          errorMessage = error.message
        }
      } catch (e) {
        console.error("Error parsing error response:", e)
      }

      // If server-side deletion fails, offer to leave the chat instead
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
        action: (
          <Button variant="outline" onClick={() => handleLeaveChat()} className="ml-2">
            Leave Chat Instead
          </Button>
        ),
      })
    } finally {
      setIsDeleting(false)
    }
  }

  // Fallback function to leave the chat if deletion fails
  const handleLeaveChat = async () => {
    try {
      setIsDeleting(true)
      await channel.removeMembers([currentUserId])

      if (setActiveChannel) {
        setActiveChannel(undefined)
      }

      toast({
        description: "You have left the chat",
      })

      router.push("/messages")
      setShowDialog(false)
    } catch (error) {
      console.error("Error leaving chat:", error)
      toast({
        variant: "destructive",
        description: "Failed to leave chat. Please try again.",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <Button variant="ghost" size="icon" className={className} onClick={() => setShowDialog(true)} title="Delete chat">
        <Trash2 className="h-5 w-5 text-destructive" />
      </Button>

      <Dialog open={showDialog} onOpenChange={(open) => !isDeleting && setShowDialog(open)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Chat</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this chat? This action cannot be undone and will remove the chat for all
              participants.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-row justify-end gap-2 sm:justify-end">
            <Button variant="outline" onClick={() => setShowDialog(false)} disabled={isDeleting}>
              Cancel
            </Button>
            <LoadingButton variant="destructive" onClick={handleDeleteChat} loading={isDeleting}>
              Delete
            </LoadingButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

