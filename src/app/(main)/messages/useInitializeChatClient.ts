"use client"

import kyInstance from "@/lib/ky"
import { useEffect, useState } from "react"
import { StreamChat } from "stream-chat"
import { useSession } from "../SessionProvider"

// init streamchat client
// create connect to stream and connect our user
// call the get-token endpoint to get a token for the user
// disconnect the user when the component unmounts

export default function useInitializeChatClient() {
  const { user } = useSession()
  const [chatClient, setChatClient] = useState<StreamChat | null>(null)

  useEffect(() => {
    const client = StreamChat.getInstance(process.env.NEXT_PUBLIC_STREAM_KEY!)

    // Set up global event handlers before connecting user
    const handleConnectionRecovered = () => {
      // Force refresh channels when connection is recovered
      client.queryChannels(
        {
          type: "messaging",
          members: { $in: [user!.id] },
        },
        {},
        { watch: true },
      )
    }

    client.on("connection.recovered", handleConnectionRecovered)

    client
      .connectUser(
        {
          id: user!.id,
          username: user!.username,
          name: user!.displayName,
          image: user!.avatarUrl,
        },
        async () =>
          kyInstance
            .get("/api/get-token")
            .json<{ token: string }>()
            .then((data) => data.token),
      )
      .catch((error) => console.error("Failed to connect user", error))
      .then(() => setChatClient(client))

    // clean up useeffect
    return () => {
      client.off("connection.recovered", handleConnectionRecovered)
      setChatClient(null)
      client
        .disconnectUser()
        .catch((error) => console.error("Failed to disconnect user", error))
        .then(() => {})
    }
  }, [user!.id, user!.username, user!.displayName, user!.avatarUrl])

  return chatClient
}

