import { CommentsPage } from "@/lib/types";
import {
  InfiniteData,
  QueryKey,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useToast } from "../ui/use-toast";
import { deleteComment, submitComment } from "./actions";

// In useSubmitCommentMutation
export function useSubmitCommentMutation(vinylId: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: submitComment,
    onSuccess: async (newComment) => {
      const commentsQueryKey: QueryKey = ["comments", vinylId];
      await queryClient.cancelQueries({ queryKey: commentsQueryKey });

      // Update comments data
      queryClient.setQueryData<InfiniteData<CommentsPage, string | null>>(
        commentsQueryKey,
        (oldData) => {
          if (!oldData) return oldData;

          const firstPage = oldData.pages[0];
          if (firstPage) {
            return {
              pageParams: oldData.pageParams,
              pages: [
                {
                  previousCursor: firstPage.previousCursor,
                  comments: [...firstPage.comments, newComment],
                  commentsCount: firstPage.commentsCount + 1,
                },
                ...oldData.pages.slice(1),
              ],
            };
          }
          return oldData;
        },
      );

      // Update vinyl data to keep comment count in sync
      const vinylQueryKey: QueryKey = ["vinyl", vinylId];
      queryClient.setQueryData(vinylQueryKey, (oldData: any) => {
        if (!oldData) return oldData;
        
        return {
          ...oldData,
          _count: {
            ...oldData._count,
            comments: (oldData._count?.comments || 0) + 1,
          },
        };
      });

      // Also update any vinyl lists that might contain this vinyl
      queryClient.setQueriesData({ queryKey: ["vinyls"] }, (oldData: any) => {
        if (!oldData) return oldData;
        
        // If it's an infinite query
        if (oldData.pages) {
          return {
            ...oldData,
            pages: oldData.pages.map((page: any) => ({
              ...page,
              vinyls: Array.isArray(page.vinyls) 
                ? page.vinyls.map((vinyl: any) => 
                    vinyl.id === vinylId 
                      ? {
                          ...vinyl,
                          _count: {
                            ...vinyl._count,
                            comments: (vinyl._count?.comments || 0) + 1,
                          },
                        }
                      : vinyl
                  )
                : page.vinyls,
            })),
          };
        }
        
        return oldData;
      });

      // Invalidate queries to ensure fresh data on next fetch
      queryClient.invalidateQueries({ queryKey: commentsQueryKey });

      toast({
        description: "Comment created",
      });
    },
    onError(error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Failed to submit comment. Please try again.",
      });
    },
  });

  return mutation;
}

// In useDeleteCommentMutation
export function useDeleteCommentMutation() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteComment,
    onSuccess: async (deletedComment) => {
      const vinylId = deletedComment.vinylId;
      const commentsQueryKey: QueryKey = ["comments", vinylId];
      
      await queryClient.cancelQueries({ queryKey: commentsQueryKey });

      // Update comments data
      queryClient.setQueryData<InfiniteData<CommentsPage, string | null>>(
        commentsQueryKey,
        (oldData) => {
          if (!oldData) return oldData;

          return {
            pageParams: oldData.pageParams,
            pages: oldData.pages.map((page) => ({
              previousCursor: page.previousCursor,
              comments: page.comments.filter((c) => c.id !== deletedComment.id),
              commentsCount: Math.max(0, page.commentsCount - 1),
            })),
          };
        },
      );

      // Update vinyl data to keep comment count in sync
      const vinylQueryKey: QueryKey = ["vinyl", vinylId];
      queryClient.setQueryData(vinylQueryKey, (oldData: any) => {
        if (!oldData) return oldData;
        
        return {
          ...oldData,
          _count: {
            ...oldData._count,
            comments: Math.max(0, (oldData._count?.comments || 0) - 1),
          },
        };
      });

      // Also update any vinyl lists that might contain this vinyl
      queryClient.setQueriesData({ queryKey: ["vinyls"] }, (oldData: any) => {
        if (!oldData) return oldData;
        
        // If it's an infinite query
        if (oldData.pages) {
          return {
            ...oldData,
            pages: oldData.pages.map((page: any) => ({
              ...page,
              vinyls: Array.isArray(page.vinyls) 
                ? page.vinyls.map((vinyl: any) => 
                    vinyl.id === vinylId 
                      ? {
                          ...vinyl,
                          _count: {
                            ...vinyl._count,
                            comments: Math.max(0, (vinyl._count?.comments || 0) - 1),
                          },
                        }
                      : vinyl
                  )
                : page.vinyls,
            })),
          };
        }
        
        return oldData;
      });

      // Invalidate queries to ensure fresh data on next fetch
      queryClient.invalidateQueries({ queryKey: commentsQueryKey });

      toast({
        description: "Comment deleted",
      });
    },
    onError(error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Failed to delete comment. Please try again.",
      });
    },
  });

  return mutation;
}