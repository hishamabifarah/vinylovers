import { validateRequest } from "@/auth"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    // Validate the user is authenticated
    const { user } = await validateRequest()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get channel ID from request body
    const { channelId } = await request.json()

    if (!channelId) {
      return NextResponse.json({ error: "Channel ID is required" }, { status: 400 })
    }

    // This endpoint just logs that the user left the channel
    // The actual removal is handled client-side
    console.log(`User ${user.id} left channel: ${channelId}`)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error processing leave channel request:", error)

    return NextResponse.json(
      {
        error: "Failed to process request",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

