import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { FollowingPage, getUserDataSelect } from "@/lib/types";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params: { userId } }: { params: { userId: string } },
) {
  try {
    const cursor = req.nextUrl.searchParams.get("cursor") || undefined
    const pageSize = 10

    const { user } = await validateRequest()

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    // First, get the follow relationships
    const followRelationships = await prisma.follow.findMany({
      where: {
        followerId: userId,
        ...(cursor
          ? {
              followingId: {
                gt: cursor,
              },
            }
          : {}),
      },
      select: {
        followingId: true,
      },
      orderBy: {
        followingId: "asc",
      },
      take: pageSize + 1, // Take one more to determine if there are more items
    })

    // Check if there are more items
    const hasMore = followRelationships.length > pageSize
    const items = hasMore ? followRelationships.slice(0, pageSize) : followRelationships

    // Get the next cursor
    const nextCursor = hasMore ? items[items.length - 1].followingId : null

    // Get the IDs of the users being followed
    const followingIds = items.map((item) => item.followingId)

    // Now fetch the complete user data for these IDs
    const followingUsers = await prisma.user.findMany({
      where: {
        id: {
          in: followingIds,
        },
      },
      select: getUserDataSelect(user.id),
      orderBy: {
        id: "asc", // Maintain the same order as the IDs
      },
    })

    const data: FollowingPage = {
      following: followingUsers,
      nextCursor,
    }
    return Response.json(data);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}