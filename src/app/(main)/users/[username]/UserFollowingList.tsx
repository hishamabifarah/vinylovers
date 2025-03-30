"use client";

import InfiniteScrollContainer from "@/components/InfiniteScrollContainer";
import FollowingLoadingSkeleton from "@/components/FollowingLoadingSkeleton";
import kyInstance from "@/lib/ky";
import { FollowingPage } from "@/lib/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import FollowButton from "@/components/FollowButton";

interface UserPostsProps {
  userId: string;
  currentUserId?: string // Add this prop to receive the logged-in user's ID
}

export default function UserFollowingList({ userId, currentUserId }: UserPostsProps) {

  const isCurrentUser = currentUserId && userId === currentUserId;

  console.log("isCurrentUser", isCurrentUser);
  console.log("userId", userId);
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["following-feed", "user-following", userId],
    queryFn: ({ pageParam }) =>
      kyInstance
        .get(
          `/api/users/${userId}/following-list`,
          pageParam ? { searchParams: { cursor: pageParam } } : {},
        )
        .json<FollowingPage>(),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const following = data?.pages.flatMap((page) => page.following) || [];

  if (status === "pending") {
    return <FollowingLoadingSkeleton />;
  }

  if (status === "success" && !following.length && !hasNextPage) {
    return (
      <p className="text-center text-muted-foreground">
        This user hasn&apos;t followed anyone yet
      </p>
    );
  }

  if (status === "error") {
    return (
      <p className="text-center text-destructive">
        An error occurred while loading following list.
      </p>
    );
  }

  return (

    <InfiniteScrollContainer
      className="w-[100%] flex flex-col gap-4"
      onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
    >
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Following List</h1>
        {following.map((user) => (
          <div key={user.id} className="flex items-center justify-between p-4 rounded-lg border bg-card text-card-foreground shadow-sm hover:bg-muted/50 transition-colors">
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
                <h3 className="font-semibold truncate">{user.username}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground truncate">@{user.username}</p>
              </div>
            </Link>

            <div className="flex items-center gap-2 sm:gap-4">
              {/* <div className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
                <span className="font-medium text-foreground">{user._count?.vinyls || 0}</span> vinyls
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground hidden md:block">
                <span className="font-medium text-foreground">{user._count?.followers || 0}</span> followers
              </div> */}

              {isCurrentUser ? (
                <FollowButton
                  userId={user.id}
                  initialState={{
                    followers: user._count.followers,
                    isFollowedByUser: user.followers.some(
                      ({ followerId }) => followerId === currentUserId,
                    ),
                  }}
                />
              ) : null /* Show follow button only if the displayed user is not the logged-in user */}
              
            </div>
          </div>
        ))}
      </div>
      {isFetchingNextPage && <Loader2 className="mx-auto my-3 animate-spin" />}
    </InfiniteScrollContainer>
  );
}