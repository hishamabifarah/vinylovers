import kyInstance from "@/lib/ky";
import { BookmarkInfo } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  QueryKey,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Bookmark } from "lucide-react";
import { useToast } from "../ui/use-toast";

interface BookmarkButtonProps {
  vinylId: string;
  initialState: BookmarkInfo;
}

export default function BookmarkButton({
  vinylId,
  initialState,
}: BookmarkButtonProps) {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  const queryKey: QueryKey = ["bookmark-info", vinylId];

  const { data } = useQuery({
    queryKey,
    queryFn: () =>
      kyInstance.get(`/api/vinyls/${vinylId}/bookmark`).json<BookmarkInfo>(),
    initialData: initialState,
    staleTime: Infinity,
  });

  const { mutate } = useMutation({
    mutationFn: () =>
      data.isBookmarkedByUser
        ? kyInstance.delete(`/api/vinyls/${vinylId}/bookmark`)
        : kyInstance.post(`/api/vinyls/${vinylId}/bookmark`),
    onMutate: async () => {
      toast({
        description: `Vinyl ${data.isBookmarkedByUser ? "un" : ""}bookmarked`,
      });

      await queryClient.cancelQueries({ queryKey });

      const previousState = queryClient.getQueryData<BookmarkInfo>(queryKey);

      queryClient.setQueryData<BookmarkInfo>(queryKey, () => ({
        isBookmarkedByUser: !previousState?.isBookmarkedByUser,
      }));

      return { previousState };
    },
    onError(error, variables, context) {
      queryClient.setQueryData(queryKey, context?.previousState);
      console.error(error);
      toast({
        variant: "destructive",
        description: "Something went wrong. Please try again.",
      });
    },
  });

  return (
    <button onClick={() => mutate()} className="flex items-center gap-2">
      <Bookmark
        className={cn(
          "size-5",
          data.isBookmarkedByUser && "fill-primary text-primary",
        )}
      />
    </button>
  );
}