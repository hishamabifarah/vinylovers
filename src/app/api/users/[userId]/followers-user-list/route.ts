import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { FollowersPage, FollowingPage, getUserDataSelect } from "@/lib/types";
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
  
    // First, check if the user has any followers using the same query as the follower count API
    const followerCount = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        _count: {
          select: {
            followers: true,
          },
        },
      },
    })

    // If user not found or has no followers, return empty result
    if (!followerCount || followerCount._count.followers === 0) {
      console.log("No followers found for user:", userId)
      return Response.json({
        followers: [],
        nextCursor: null,
      })
    }

    // First, get the follow relationships
    const followRelationships = await prisma.follow.findMany({
      where: {
        followingId: userId, // People following this user (followers)
        ...(cursor
          ? {
              followerId: {
                // Use followerId for cursor with followers
                gt: cursor,
              },
            }
          : {}),
      },
      select: {
        followerId: true, // Select the follower IDs
      },
      orderBy: {
        followerId: "asc", // Order by follower ID
      },
      take: pageSize + 1, // Take one more to determine if there are more items
    })

    // Double check that we actually have results
    if (followRelationships.length === 0) {
      console.log("No follow relationships found despite count > 0")
      return Response.json({
        followers: [],
        nextCursor: null,
      })
    }

    // Check if there are more items
    const hasMore = followRelationships.length > pageSize
    const items = hasMore ? followRelationships.slice(0, pageSize) : followRelationships

    // Get the next cursor
    const nextCursor = hasMore && items.length > 0 ? items[items.length - 1].followerId : null

    // Get the IDs of the followers
    const followerIds = items.map((item) => item.followerId)

    // Now fetch the complete user data for these IDs
    const followerUsers = await prisma.user.findMany({
      where: {
        id: {
          in: followerIds,
        },
      },
      select: getUserDataSelect(user.id),
      orderBy: {
        id: "asc", // Maintain the same order as the IDs
      },
    })

    console.log("Fetched follower users:", followerUsers.length)
    console.log("Next cursor:", nextCursor)

    const data: FollowersPage = {
      followers: followerUsers,
      nextCursor,
    }

    return Response.json(data)
  } catch (error) {
    console.error(error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
