"use client";

import InfiniteScrollContainer from "@/components/InfiniteScrollContainer";
import { VinylCard } from "@/components/vinyls/VinylsCard";
import VinylsLoadingSkeleton from "@/components/vinyls/VinylsLoadingSkeleton";
// import PostsLoadingSkeleton from "@/components/posts/PostsLoadingSkeleton";
import kyInstance from "@/lib/ky";
import { VinylsPage } from "@/lib/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

interface GenreVinylsProps {
  genreId: string;
  genreName: string;
}

export default function GenreVinyls ({ genreId , genreName }: GenreVinylsProps) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["genre-feed", genreId],
    queryFn: ({ pageParam }) =>
      kyInstance
        .get(
          `/api/genres/${genreId}`,
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
        No Vinyls with this genre have been added yet!
      </p>
    );
  }

  if (status === "error") {
    return (
      <p className="text-center text-destructive">
        An error occurred while loading vinyls.
      </p>
    );
  }

  return (
    <InfiniteScrollContainer
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
    >
      {vinyls.map((vinyl) => (
        <VinylCard key={vinyl.id} vinyl={vinyl} />
      ))}
      {isFetchingNextPage && <Loader2 className="mx-auto my-3 animate-spin" />}
    </InfiniteScrollContainer>
  );
}