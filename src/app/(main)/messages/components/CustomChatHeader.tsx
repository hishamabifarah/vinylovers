"use client"

import { useChannelStateContext, useChatContext } from "stream-chat-react"
import DeleteChatButton from "./DeleteChatButton"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import UserAvatar from "@/components/UserAvatar"

export default function CustomChatHeader() {
  const { channel } = useChannelStateContext()
  const { client } = useChatContext()
  const router = useRouter()

  if (!channel || !client) return null

  // Get channel data
  const otherMembers = Object.values(channel.state.members || {}).filter((member) => member.user_id !== client.userID)

  // For direct messages, show the other user's name
  // For group chats, show the channel name
  const channelName =
    channel.data?.name || otherMembers.map((member) => member.user?.name || member.user?.id).join(", ")

  // Get avatar for 1:1 chats
  const avatarUrl = otherMembers.length === 1 ? otherMembers[0].user?.image : undefined

  return (
    <div className="flex items-center justify-between border-b px-4 py-3">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => router.push("/chat")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <UserAvatar avatarUrl={avatarUrl} />

        <div>
          <h3 className="font-semibold">{channelName}</h3>
          <p className="text-xs text-muted-foreground">
            {otherMembers.length > 1 ? `${otherMembers.length} members` : "Direct message"}
          </p>
        </div>
      </div>

       <div className="flex items-center gap-2">
        <DeleteChatButton />
      </div> 
    </div>
  )
}

