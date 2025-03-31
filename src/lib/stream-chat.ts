import { StreamChat } from "stream-chat"

// Cache the client instance
let streamChatClient: StreamChat | null = null

export function getServerStreamClient() {
  if (!streamChatClient) {
    streamChatClient = StreamChat.getInstance(process.env.STREAM_API_KEY!, process.env.STREAM_API_SECRET!)
  }

  return streamChatClient
}

export async function connectAdminUser(client: StreamChat) {
  await client.connectUser(
    {
      id: "server-admin",
      name: "Server Admin",
      role: "admin",
    },
    client.createToken("server-admin"),
  )

  return client
}

