"use server"

import { validateRequest } from "@/auth"
import prisma from "@/lib/prisma"

export async function followUser(userId: string) {
  try {
    const { user } = await validateRequest()

    if (!user) {
      throw new Error("Unauthorized")
    }

    if (user.id === userId) {
      throw new Error("Cannot follow yourself")
    }

    await prisma.follow.create({
      data: {
        followerId: user.id,
        followingId: userId,
      },
    })

    return { success: true }
  } catch (error) {
    console.error("Error following user:", error)
    throw new Error("Failed to follow user")
  }
}

export async function unfollowUser(userId: string) {
  try {
    const { user } = await validateRequest()

    if (!user) {
      throw new Error("Unauthorized")
    }

    await prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId: user.id,
          followingId: userId,
        },
      },
    })

    return { success: true }
  } catch (error) {
    console.error("Error unfollowing user:", error)
    throw new Error("Failed to unfollow user")
  }
}

export async function getFollowers(userId: string, cursor?: string, limit = 10) {
  try {
    const { user } = await validateRequest()

    // Get followers with pagination
    const followers = await prisma.follow.findMany({
      where: {
        followingId: userId, // People following this user
      },
      include: {
        follower: {
          select: {
            id: true,
            username: true,
            bio: true,
            _count: {
              select: {
                followers: true,
                following: true,
                vinyls: true,
              },
            },
            followers: user
              ? {
                  where: {
                    followerId: user.id,
                  },
                  select: {
                    followerId: true,
                  },
                }
              : undefined,
          },
        },
      },
      orderBy: {
        follower: {
          username: "asc",
        },
      },
      take: limit + 1, // Take one more to determine if there are more items
      ...(cursor
        ? {
            cursor: {
              followerId_followingId: {
                followerId: cursor,
                followingId: userId,
              },
            },
            skip: 1, // Skip the cursor
          }
        : {}),
    })

    // Check if there are more items
    const hasMore = followers.length > limit
    const items = hasMore ? followers.slice(0, limit) : followers

    // Get the next cursor
    const nextCursor = hasMore ? items[items.length - 1].followerId : null

    return {
      items: items.map((follow) => ({
        ...follow.follower,
        isFollowing: user ? follow.follower.followers.length > 0 : false,
        followers: undefined, // Remove the raw followers data
      })),
      nextCursor,
    }
  } catch (error) {
    console.error("Error fetching followers:", error)
    throw new Error("Failed to fetch followers")
  }
}

export async function getFollowing(userId: string, cursor?: string, limit = 10) {
  try {
    const { user } = await validateRequest()

    // Get users that this user is following
    const following = await prisma.follow.findMany({
      where: {
        followerId: userId, // People this user follows
      },
      include: {
        following: {
          select: {
            id: true,
            username: true,
            bio: true,
            _count: {
              select: {
                followers: true,
                following: true,
                vinyls: true,
              },
            },
            followers: user
              ? {
                  where: {
                    followerId: user.id,
                  },
                  select: {
                    followerId: true,
                  },
                }
              : undefined,
          },
        },
      },
      orderBy: {
        following: {
          username: "asc",
        },
      },
      take: limit + 1, // Take one more to determine if there are more items
      ...(cursor
        ? {
            cursor: {
              followerId_followingId: {
                followerId: userId,
                followingId: cursor,
              },
            },
            skip: 1, // Skip the cursor
          }
        : {}),
    })

    // Check if there are more items
    const hasMore = following.length > limit
    const items = hasMore ? following.slice(0, limit) : following

    // Get the next cursor
    const nextCursor = hasMore ? items[items.length - 1].followingId : null

    return {
      items: items.map((follow) => ({
        ...follow.following,
        isFollowing: user ? follow.following.followers.length > 0 : false,
        followers: undefined, // Remove the raw followers data
      })),
      nextCursor,
    }
  } catch (error) {
    console.error("Error fetching following:", error)
    throw new Error("Failed to fetch following")
  }
}

