import { validateRequest } from "@/auth"
import { Button } from "@/components/ui/button"
import prisma from "@/lib/prisma"
import streamServerClient from "@/lib/stream"
import { Bookmark, Home } from "lucide-react"
import Link from "next/link"
import MessagesButton from "./MessagesButton"
import NotificationsButton from "../NotificationsButton"

async function getUnreadMessagesCountSafely(userId: string): Promise<number> {
  try {
    const result = await streamServerClient.getUnreadCount(userId)
    return result.total_unread_count
  } catch (error) {
    console.error("Error fetching unread messages count:", error)

    // Handle "user not found" error by creating the user
    if (error instanceof Error && error.message.includes("user not found")) {
      try {
        // Get user data from database
        const userData = await prisma.user.findUnique({
          where: { id: userId },
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
          },
        })

        if (userData) {
          // Create user in StreamChat
          await streamServerClient.upsertUser({
            id: userData.id,
            name: userData.displayName || userData.username,
            username: userData.username,
            image: userData.avatarUrl,
          })

          console.log("Successfully created user in StreamChat:", userId)
          // Return 0 for newly created users (no messages yet)
          return 0
        }
      } catch (createError) {
        console.error("Error creating user in StreamChat:", createError)
      }
    }

    // Return 0 as fallback for any error
    return 0
  }
}

interface MenuBarProps {
  className?: string
}

export default async function MenuBar({ className }: MenuBarProps) {
  const { user } = await validateRequest()

  if (!user) return null

  const [unreadNotificationsCount, unreadMessagesCount] = await Promise.all([
    prisma.notification.count({
      where: {
        recipientId: user.id,
        read: false,
      },
    }),
    getUnreadMessagesCountSafely(user.id),
  ])

  return (
    <div className={className}>
      <Button variant="ghost" className="flex items-center justify-start gap-3" title="Home" asChild>
        <Link href="/home">
          <Home />
        </Link>
      </Button>

      <Button variant="ghost" className="flex items-center justify-start gap-3" title="Bookmarks" asChild>
        <Link href="/bookmarks">
          <Bookmark />
        </Link>
      </Button>

      <NotificationsButton initialState={{ unreadCount: unreadNotificationsCount }} />

      <Button variant="ghost" className="flex items-center justify-start gap-3" title="Messages" asChild>
        <MessagesButton initialState={{ unreadCount: unreadMessagesCount }} />
      </Button>
    </div>
  )
}
