import { validateRequest } from "@/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { user } = await validateRequest()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const url = new URL(request.url)
    const searchQuery = url.searchParams.get("q") || ""

    // Find users who the current user follows AND who follow the current user back
    const mutualFollowers = await prisma.user.findMany({
      where: {
        // Users who follow the current user
        followers: {
          some: {
            followerId: user.id,
          },
        },
        // Users who are followed by the current user
        following: {
          some: {
            followingId: user.id,
          },
        },
        // Exclude the current user
        id: { not: user.id },
        // Optional search filter
        ...(searchQuery
          ? {
              OR: [
                { username: { contains: searchQuery, mode: "insensitive" } },
                { displayName: { contains: searchQuery, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      select: {
        id: true,
        username: true,
        displayName: true,
        avatarUrl: true,
      },
      orderBy: {
        displayName: "asc",
      },
      take: 15,
    })

    return NextResponse.json(mutualFollowers)
  } catch (error) {
    console.error("Error fetching mutual followers:", error)
    return NextResponse.json({ error: "Failed to fetch mutual followers" }, { status: 500 })
  }
}

