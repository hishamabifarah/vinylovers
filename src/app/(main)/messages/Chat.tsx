"use client"

import { Loader2 } from "lucide-react"
import { useTheme } from "next-themes"
import { useState, useEffect } from "react"
import { Chat as StreamChat } from "stream-chat-react"
import ChatChannel from "./ChatChannel"
import ChatSidebar from "./ChatSidebar"
import useInitializeChatClient from "./useInitializeChatClient"

export default function Chat() {
  const chatClient = useInitializeChatClient() // initialize stream chat client ONCE

  const { resolvedTheme } = useTheme()

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [forceUpdate, setForceUpdate] = useState(0)

  // Listen for custom events to force re-renders when needed
  useEffect(() => {
    if (!chatClient) return

    const handleNewChannel = () => {
      setForceUpdate((prev) => prev + 1)
    }

    chatClient.on("channel.created", handleNewChannel)
    chatClient.on("notification.added_to_channel", handleNewChannel)

    return () => {
      chatClient.off("channel.created", handleNewChannel)
      chatClient.off("notification.added_to_channel", handleNewChannel)
    }
  }, [chatClient])

  if (!chatClient) {
    return <Loader2 className="mx-auto my-3 animate-spin" />
  }

  return (
    <main className="relative w-full overflow-hidden rounded-2xl bg-card shadow-sm">
      <div className="absolute bottom-0 top-0 flex w-full">
        <StreamChat
          client={chatClient}
          theme={resolvedTheme === "dark" ? "str-chat__theme-dark" : "str-chat__theme-light"}
          key={`stream-chat-${forceUpdate}`}
        >
          <ChatSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <ChatChannel open={!sidebarOpen} openSidebar={() => setSidebarOpen(true)} />
        </StreamChat>
      </div>
    </main>
  )
}

