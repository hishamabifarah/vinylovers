import { useChatContext } from "stream-chat-react"
import ChatOptions from "./ChatOptions"
import UserAvatar from "@/components/UserAvatar"

export default function CustomChatHeader() {

    // Remove channel search input
    setTimeout(() => {
      const channelSearchInput = document.getElementsByClassName('str-chat__channel-search');
      if (channelSearchInput) {
        if (channelSearchInput[0] && channelSearchInput[0].parentNode) {
          channelSearchInput[0].parentNode.removeChild(channelSearchInput[0]);
        }
      }
    }, 1000);
  const { channel } = useChatContext()

  if (!channel) return null

  // Get other members (not the current user)
  const otherMembers = Object.values(channel.state.members || {})
    .filter((member) => !member.user?.me)
    .map((member) => member.user)

  // For group chats, use the channel name
  // For 1:1 chats, use the other user's name
  const chatName = channel.data?.name || otherMembers[0]?.name || otherMembers[0]?.id || "Chat"

  console.log('otherMembers', otherMembers) 

  return (
    <div className="flex items-center justify-between px-4 py-2 border-b">
      <div className="flex items-center gap-2">
        {otherMembers.length === 1 ? (
          <UserAvatar avatarUrl={otherMembers[0]?.image} />
        ) : (
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground">
            {otherMembers.length}
          </div>
        )}
        <div>
          <h3 className="font-medium">{chatName}</h3>
          {otherMembers.length > 1 && (
            <p className="text-xs text-muted-foreground">{otherMembers.length} participants</p>
          )}
        </div>
      </div>
      <ChatOptions />
    </div>
  )
}

