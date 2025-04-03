import { validateRequest } from "@/auth"
import { NextResponse } from "next/server"
import { StreamChat } from "stream-chat"

export async function POST(request: Request) {
  try {
    // Validate the user is authenticated
    const { user } = await validateRequest()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get channel ID from request body
    const { channelId, channelType = "messaging" } = await request.json()

    if (!channelId) {
      return NextResponse.json({ error: "Channel ID is required" }, { status: 400 })
    }

    // Check if environment variables are set
    if (!process.env.NEXT_PUBLIC_STREAM_KEY || !process.env.STREAM_SECRET) {
      console.error("Stream API key or secret is missing")
      return NextResponse.json(
        {
          error: "Server configuration error",
          details: "Stream API credentials are not properly configured",
        },
        { status: 500 },
      )
    }

    // Initialize Stream client with server-side API key and secret
    const serverClient = StreamChat.getInstance(process.env.NEXT_PUBLIC_STREAM_KEY, process.env.STREAM_SECRET)

    // Important: Connect as a server-side admin user
    try {
      await serverClient.connectUser(
        {
          id: "server-admin",
          name: "Server Admin",
          role: "admin",
        },
        serverClient.createToken("server-admin"),
      )
    } catch (connectError) {
      console.error("Error connecting admin user:", connectError)
      return NextResponse.json(
        {
          error: "Failed to authenticate with Stream",
          details: connectError instanceof Error ? connectError.message : String(connectError),
        },
        { status: 500 },
      )
    }

    try {
      // Get the channel
      const channel = serverClient.channel(channelType, channelId)

      // First, verify the user is a member of this channel
      const memberResponse = await channel.queryMembers({ user_id: user.id })

      if (memberResponse.members.length === 0) {
        await serverClient.disconnectUser()
        return NextResponse.json({ error: "You are not a member of this channel" }, { status: 403 })
      }

      // Delete the channel
      await channel.delete()
    } catch (channelError) {
      console.error("Error with channel operations:", channelError)
      return NextResponse.json(
        {
          error: "Failed to delete channel",
          details: channelError instanceof Error ? channelError.message : String(channelError),
        },
        { status: 500 },
      )
    } finally {
      // Always disconnect the admin user
      try {
        await serverClient.disconnectUser()
      } catch (disconnectError) {
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting channel:", error)

    // Return detailed error information
    return NextResponse.json(
      {
        error: "Failed to delete channel",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

