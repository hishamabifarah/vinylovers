"use client"

import InfiniteScrollContainer from "@/components/InfiniteScrollContainer"
import FollowingLoadingSkeleton from "@/components/FollowingLoadingSkeleton"
import kyInstance from "@/lib/ky"
import type { FollowingPage } from "@/lib/types"
import { useInfiniteQuery } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import FollowButton from "@/components/FollowButton"
import { useSession } from "../../SessionProvider"


interface UserFollowingListProps {
  userId: string
  currentUserId?: string
}

export default function UserFollowingList({ userId, currentUserId }: UserFollowingListProps) {
  // Get the current user from useSession
  const { user } = useSession()
  // const { user } = session || { user: null }

  // Use the prop if available, otherwise fall back to the session user
  const actualCurrentUserId = currentUserId || user?.id

  console.log("UserFollowingList - Current user ID:", actualCurrentUserId)
  console.log("UserFollowingList - Profile user ID:", userId)

  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status } = useInfiniteQuery({
    queryKey: ["following-feed", "user-following", userId],
    queryFn: ({ pageParam }) =>
      kyInstance
        .get(`/api/users/${userId}/following-list`, pageParam ? { searchParams: { cursor: pageParam } } : {})
        .json<FollowingPage>(),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  })

  const following = data?.pages.flatMap((page) => page.following) || []

  if (status === "pending") {
    return <FollowingLoadingSkeleton />
  }

  if (status === "success" && !following.length && !hasNextPage) {
    return <p className="text-center text-muted-foreground">This user hasn&apos;t followed anyone yet</p>
  }

  if (status === "error") {
    return <p className="text-center text-destructive">An error occurred while loading following list.</p>
  }

  return (
    <InfiniteScrollContainer
      className="w-[100%] flex flex-col gap-4"
      onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
    >
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Following List</h1>
        {following.map((user) => {
          // This checks if the user in the list is the currently logged-in user
          const isCurrentLoggedInUser = actualCurrentUserId && String(user.id) === String(actualCurrentUserId)

          console.log(`User ${user.username} (${user.id}): isCurrentLoggedInUser = ${isCurrentLoggedInUser}`)

          return (
            <div
              key={user.id}
              className="flex items-center justify-between p-4 rounded-lg border bg-card text-card-foreground shadow-sm hover:bg-muted/50 transition-colors"
            >
              <Link href={`/users/${user.username}`} className="flex items-center gap-3 flex-1">
                <div className="relative h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 overflow-hidden rounded-full">
                  <Image
                    src={user.avatarUrl || "/placeholder.svg?height=48&width=48"}
                    alt={user.username}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold truncate">{user.displayName || user.username}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">@{user.username}</p>
                </div>
              </Link>

              <div className="flex items-center gap-2 sm:gap-4">
                {/* Only show "You" if this user in the list is the currently logged-in user */}
                {isCurrentLoggedInUser ? (
                  <span className="text-xs sm:text-sm text-muted-foreground px-3 py-1 border rounded-md">You</span>
                ) : (
                  <FollowButton
                    userId={user.id}
                    initialState={{
                      followers: user._count.followers,
                      isFollowedByUser:
                        user.followers && user.followers.some(({ followerId }) => followerId === actualCurrentUserId),
                    }}
                  />
                )}
              </div>
            </div>
          )
        })}
      </div>
      {isFetchingNextPage && <Loader2 className="mx-auto my-3 animate-spin" />}
    </InfiniteScrollContainer>
  )
}

