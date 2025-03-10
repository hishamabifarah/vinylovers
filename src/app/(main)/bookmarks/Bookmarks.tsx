"use client";

import InfiniteScrollContainer from "@/components/InfiniteScrollContainer";
import Vinyl from "@/components/vinyls/Vinyl";
import { VinylCard } from "@/components/vinyls/VinylsCard";
import VinylsLoadingSkeleton from "@/components/vinyls/VinylsLoadingSkeleton";
import kyInstance from "@/lib/ky";
import { VinylsPage } from "@/lib/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

export default function Bookmarks() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["vinylfeed", "bookmarks"],
    queryFn: ({ pageParam }) =>
      kyInstance
        .get(
          "/api/vinyls/bookmarked",
          pageParam ? { searchParams: { cursor: pageParam } } : {},
        )
        .json<VinylsPage>(),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const vinyls = data?.pages.flatMap((page) => page.vinyls) || [];

  if (status === "pending") {
    return <VinylsLoadingSkeleton />;
  }

  if (status === "success" && !vinyls.length && !hasNextPage) {
    return (
      <p className="text-center text-muted-foreground">
        You don&apos;t have any bookmarks yet.
      </p>
    );
  }

  if (status === "error") {
    return (
      <p className="text-center text-destructive">
        An error occurred while loading bookmarks.
      </p>
    );
  }

  return (
    <InfiniteScrollContainer
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4"
      onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
    >
      {vinyls.map((vinyl) => (
        <VinylCard key={vinyl.id} vinyl={vinyl} />
      ))}
      {isFetchingNextPage && <Loader2 className="mx-auto my-3 animate-spin" />}
    </InfiniteScrollContainer>
  );
}