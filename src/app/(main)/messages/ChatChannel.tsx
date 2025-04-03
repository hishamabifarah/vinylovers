"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Menu, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import {
  Channel,
  ChannelHeader,
  type ChannelHeaderProps,
  MessageInput,
  MessageList,
  useChatContext,
  Window,
} from "stream-chat-react"
import CustomChatHeader from "./components/CustomChatHeader"
import { useSession } from "../SessionProvider"
import { useToast } from "@/components/ui/use-toast"

interface ChatChannelProps {
  open: boolean
  openSidebar: () => void
  activeChannelId?: string | null
}

export default function ChatChannel({ open, openSidebar, activeChannelId }: ChatChannelProps) {
  const { channel, client, setActiveChannel } = useChatContext()
  const { user } = useSession()
  const { toast } = useToast()
  const [isDeleting, setIsDeleting] = useState(false)

  // When activeChannelId changes, set the active channel
  useEffect(() => {
    if (activeChannelId && client) {
      const loadChannel = async () => {
        try {
          // Get the channel by ID
          const channelResponse = await client.queryChannels(
            {
              id: { $eq: activeChannelId },
            },
            {},
            { limit: 1 },
          )

          if (channelResponse.length > 0) {
            setActiveChannel(channelResponse[0])
          }
        } catch (error) {
          console.error("Error loading channel:", error)
        }
      }

      loadChannel()
    }
  }, [activeChannelId, client, setActiveChannel])

  // Listen for new messages in the current channel
  useEffect(() => {
    if (!channel) return

    const handleNewMessage = (event: any) => {
      // If we're on mobile and the sidebar is open, close it to show the message
      if (window.innerWidth < 768 && !open) {
        // Force the channel to be visible
        document.querySelector(".str-chat__container")?.classList.add("mobile-chat-visible")
      }
    }

    channel.on("message.new", handleNewMessage)

    return () => {
      channel.off("message.new", handleNewMessage)
    }
  }, [channel, open])

  // Add a useEffect to listen for channel events and update the active channel
  useEffect(() => {
    if (!client) return

    const handleAddedToChannel = (event: any) => {
      // If we don't have an active channel, set this one as active
      if (!channel && event.channel) {
        setActiveChannel(event.channel)
      }
    }

    client.on("notification.added_to_channel", handleAddedToChannel)

    return () => {
      client.off("notification.added_to_channel", handleAddedToChannel)
    }
  }, [client, channel, setActiveChannel])

  // Function to delete the current channel
  const deleteChannel = async () => {
    if (!channel) return

    try {
      setIsDeleting(true)
      await channel.delete()
      setActiveChannel(undefined)
      toast({
        description: "Chat deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting channel:", error)
      toast({
        variant: "destructive",
        description: "You don't have permission to delete this chat",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  // Check if current user is admin of the channel
  const isAdmin = channel?.state?.members?.[user!.id]?.role === "admin" || channel?.data?.created_by_id === user!.id

  return (
    <div className={cn("w-full flex flex-col h-full", !open && "md:block")}>
      {channel ? (
        <div className={cn("flex-1 flex flex-col h-full", !open && "hidden md:flex")}>
          {/* Active chat UI */}
          <Channel>
            <Window>
              <CustomChatHeader />
              <CustomChannelHeader
                openSidebar={openSidebar}
                isAdmin={isAdmin}
                onDelete={deleteChannel}
                isDeleting={isDeleting}
              />
              <MessageList />
              <MessageInput focus />
            </Window>
          </Channel>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-4 h-full">
          <p className="text-center text-muted-foreground">
            No active chat. Select a chat or start a new conversation!
          </p>
          <Button
            className="text-white mt-5"
            variant="default"
            onClick={() => {
              // Trigger the new chat dialog
              const newChatDialog = document.querySelector("#new-chat-dialog") as HTMLElement | null
              if (newChatDialog) {
                newChatDialog.click()
              }
            }}
          >
            Start New Chat
          </Button>
        </div>
      )}
    </div>
  )
}

interface CustomChannelHeaderProps extends ChannelHeaderProps {
  openSidebar: () => void
  isAdmin?: boolean
  onDelete?: () => void
  isDeleting?: boolean
}

function CustomChannelHeader({ openSidebar, isAdmin, onDelete, isDeleting, ...props }: CustomChannelHeaderProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-full p-2 md:hidden">
        <Button size="icon" variant="ghost" onClick={openSidebar}>
          <Menu className="size-5" />
        </Button>
      </div>
      <ChannelHeader {...props} />

      {/* Delete button for admin */}
      {isAdmin && onDelete && (
        <div className="ml-auto mr-2">
          <Button
            size="icon"
            variant="ghost"
            onClick={onDelete}
            disabled={isDeleting}
            className="text-red-500 hover:text-red-700 hover:bg-red-100"
            title="Delete chat"
          >
            <Trash2 className="size-5" />
          </Button>
        </div>
      )}
    </div>
  )
}

