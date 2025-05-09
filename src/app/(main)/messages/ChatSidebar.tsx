"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { MailPlus, X } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import {
  ChannelList,
  ChannelPreviewMessenger,
  type ChannelPreviewUIComponentProps,
  useChatContext,
} from "stream-chat-react"
import { useSession } from "../SessionProvider"
import NewChatDialog from "./NewChatDialog"
import { useQueryClient } from "@tanstack/react-query"

interface ChatSidebarProps {
  open: boolean
  onClose: () => void
}

export default function ChatSidebar({ open, onClose }: ChatSidebarProps) {
  const { user } = useSession()

  const queryClient = useQueryClient()

  const { channel, client } = useChatContext()

  setTimeout(() => {
    const elements = document.querySelectorAll('.str-chat__channel-search.str-chat__channel-search--inline');
    if (elements.length > 0) {
      elements[0].remove(); // Remove the first matching element
    }
  }, 300); // Delay in milliseconds (1 second)

  useEffect(() => {
    if (channel?.id) {
      queryClient.invalidateQueries({ queryKey: ["unread-messages-count"] })
    }
  }, [channel?.id, queryClient])

  useEffect(() => {
    if (!client) return

    // Listen for new channel events
    const handleNewChannel = (event: any) => {
      // Force refresh of the channel list
      queryClient.invalidateQueries({ queryKey: ["channelList"] })
    }

    // Listen for channel.created events
    client.on("channel.created", handleNewChannel)

    // Listen for notification.added_to_channel events
    client.on("notification.added_to_channel", handleNewChannel)

    return () => {
      client.off("channel.created", handleNewChannel)
      client.off("notification.added_to_channel", handleNewChannel)
    }
  }, [queryClient, client])

  const ChannelPreviewCustom = useCallback(
    (props: ChannelPreviewUIComponentProps) => (
      <ChannelPreviewMessenger
        {...props}
        onSelect={() => {
          props.setActiveChannel?.(props.channel, props.watchers)
          onClose()
        }}
      />
    ),
    [onClose],
  )

  return (
    <div className={cn("size-full flex-col border-e md:flex md:w-72", open ? "flex" : "hidden")}>
      <MenuHeader onClose={onClose} />
      <ChannelList
        filters={{
          type: "messaging",
          members: { $in: [user!.id] },
        }}
        showChannelSearch
        options={{ state: true, presence: true, limit: 8 }}
        sort={{ last_message_at: -1 }}
        additionalChannelSearchProps={{
          searchForChannels: true,
          searchQueryParams: {
            channelFilters: {
              filters: { members: { $in: [user!.id] } },
            },
          },
        }}
        Preview={ChannelPreviewCustom}
        EmptyStateIndicator={() => (
          <div className="flex flex-col items-center justify-center p-4">
            {/* <p className="text-center text-muted-foreground">
              No chats available. Start a new conversation!
            </p> */}
            {/* <Button
              variant="default"
              onClick={() => {
                // Open the new chat dialog
                const newChatDialog = document.querySelector("#new-chat-dialog") as HTMLElement | null;
                if (newChatDialog) {
                  newChatDialog.click();
                }
              }}
            >
              Start New Chat
            </Button> */}
          </div>
        )}
      />
    </div>
  )
}

interface MenuHeaderProps {
  onClose: () => void
}

function MenuHeader({ onClose }: MenuHeaderProps) {
  const [showNewChatDialog, setShowNewChatDialog] = useState(false)

  return (
    <>
      <div className="flex items-center gap-3 p-2">
        <div className="h-full md:hidden">
          <Button size="icon" variant="ghost" onClick={onClose}>
            <X className="size-5" />
          </Button>
        </div>
        <h1 className="me-auto text-xl font-bold md:ms-2">Messages</h1>
        <Button
          id="new-chat-dialog"
          size="icon"
          variant="ghost"
          title="Start new chat"
          onClick={() => setShowNewChatDialog(true)}
        >
          <MailPlus className="size-5" />
        </Button>
      </div>
      {showNewChatDialog && (
        <NewChatDialog
          onOpenChange={setShowNewChatDialog}
          onChatCreated={() => {
            setShowNewChatDialog(false)
            onClose()
          }}
        />
      )}
    </>
  )
}

