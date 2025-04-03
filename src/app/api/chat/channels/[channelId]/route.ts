import { StreamChat } from "stream-chat"
import { type NextRequest, NextResponse } from "next/server"
import { validateRequest } from "@/auth"

// This is a server-side API route that will use admin credentials to delete a channel
export async function DELETE(request: NextRequest, { params }: { params: { channelId: string } }) {
  try {
    const session = await validateRequest();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { channelId } = params;

    if (!channelId) {
      return NextResponse.json({ error: "Channel ID is required" }, { status: 400 });
    }

    const serverClient = StreamChat.getInstance(process.env.STREAM_API_KEY!, process.env.STREAM_API_SECRET!);
    const channel = serverClient.channel("messaging", channelId);

    const response = await channel.query({
      members: { limit: 100 },
      messages: { limit: 1 },
    });

    // Check if the user is the creator or has the admin role
    const isAdminOrCreator =
      response.channel?.created_by_id === session.user.id ||
      response.members.some(
        (member) => member.user_id === session.user.id && member.role === "admin"
      );

    if (!isAdminOrCreator) {
      return NextResponse.json({ error: "Only the creator or an admin can delete this channel" }, { status: 403 });
    }

    await channel.delete();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting channel:", error);
    return NextResponse.json({ error: "Failed to delete channel" }, { status: 500 });
  }
}

