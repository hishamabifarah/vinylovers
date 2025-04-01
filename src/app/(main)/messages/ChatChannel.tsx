"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Menu } from "lucide-react"
import { useEffect } from "react"
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

interface ChatChannelProps {
  open: boolean
  openSidebar: () => void
  activeChannelId?: string | null
}

export default function ChatChannel({ open, openSidebar, activeChannelId }: ChatChannelProps) {
  const { channel, client, setActiveChannel } = useChatContext()

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

  return (
    <div className={cn("w-full flex flex-col h-full", !open && "md:block")}>
      {channel ? (
        <div className={cn("flex-1 flex flex-col h-full", !open && "hidden md:flex")}>
          {/* Active chat UI */}
          <Channel>
            <Window>
              <CustomChatHeader />
              <CustomChannelHeader openSidebar={openSidebar} />
              <MessageList />
              <MessageInput focus  />
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
}

function CustomChannelHeader({ openSidebar, ...props }: CustomChannelHeaderProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-full p-2 md:hidden">
        <Button size="icon" variant="ghost" onClick={openSidebar}>
          <Menu className="size-5" />
        </Button>
      </div>
      <ChannelHeader {...props} />
    </div>
  )
}

