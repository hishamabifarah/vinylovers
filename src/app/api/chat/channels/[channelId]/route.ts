import { StreamChat } from "stream-chat"
import { type NextRequest, NextResponse } from "next/server"
import { validateRequest } from "@/auth"

// This is a server-side API route that will use admin credentials to delete a channel
export async function DELETE(request: NextRequest, { params }: { params: { channelId: string } }) {
  try {
    // Get the authenticated user from the session
    const session = await validateRequest()

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get the channel ID from the URL params
    const { channelId } = params

    if (!channelId) {
      return NextResponse.json({ error: "Channel ID is required" }, { status: 400 })
    }

    // Initialize the Stream Chat client with server-side credentials
    const serverClient = StreamChat.getInstance(process.env.STREAM_API_KEY!, process.env.STREAM_API_SECRET!)

    // Get the channel
    const channel = serverClient.channel("messaging", channelId)

    // Check if the user is the creator of the channel
    const response = await channel.query({
      members: { limit: 100 },
      messages: { limit: 1 },
    })

    // Check if the user is the creator of the channel
    if (response.channel?.created_by_id !== session.user.id) {
      return NextResponse.json({ error: "Only the creator can delete this channel" }, { status: 403 })
    }

    // Delete the channel with admin permissions
    await channel.delete()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting channel:", error)
    return NextResponse.json({ error: "Failed to delete channel" }, { status: 500 })
  }
}

