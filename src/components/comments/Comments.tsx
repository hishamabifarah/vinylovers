import kyInstance from "@/lib/ky";
import { CommentsPage, VinylData } from "@/lib/types";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import Comment from "./Comment";
import CommentInput from "./CommentInput";
import { useEffect } from "react";

interface CommentsProps {
  vinyl: VinylData;
  setCommentsCount: (count: number) => void;
}

export default function Comments({ vinyl, setCommentsCount }: CommentsProps) {
  const queryClient = useQueryClient();

  const { data, fetchNextPage, hasNextPage, isFetching, status } =
    useInfiniteQuery({
      queryKey: ["comments", vinyl.id],
      queryFn: ({ pageParam }) =>
        kyInstance
          .get(
            `/api/vinyls/${vinyl.id}/comments`,
            pageParam ? { searchParams: { cursor: pageParam } } : {},
          )
          .json<CommentsPage>(),
      initialPageParam: null as string | null,
      getNextPageParam: (firstPage) => firstPage.previousCursor,
      select: (data) => ({
        pages: [...data.pages].reverse(),
        pageParams: [...data.pageParams].reverse(),
      }),
    });

  const comments = data?.pages.flatMap((page) => page.comments) || [];
  const commentsCount = data?.pages[0]?.commentsCount || 0;

  useEffect(() => {
    if (status === "success") {
      setCommentsCount(commentsCount);
      
      // Also update the vinyl data in the cache to ensure consistency
      queryClient.setQueryData(["vinyl", vinyl.id], (oldData: any) => {
        if (!oldData) return oldData;
        
        return {
          ...oldData,
          _count: {
            ...oldData._count,
            comments: commentsCount,
          },
        };
      });
    }
  }, [commentsCount, status, setCommentsCount, queryClient, vinyl.id]);

  return (
    <div className="space-y-3">
      <CommentInput vinyl={vinyl} />
            {hasNextPage && (
        <Button
          variant="link"
          className="mx-auto block"
          disabled={isFetching}
          onClick={() => fetchNextPage()}
        >
          Load previous comments
        </Button>
      )}
      {status === "pending" && <Loader2 className="mx-auto animate-spin" />}
      {status === "success" && !comments.length && (
        <p className="text-center text-muted-foreground">No comments yet.</p>
      )}
      {status === "error" && (
        <p className="text-center text-destructive">
          An error occurred while loading comments.
        </p>
      )}
      <div className="divide-y">
        {comments.map((comment) => (
          <Comment key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
}