import { VinylData, VinylsPage } from "@/lib/types";
import {
  InfiniteData,
  QueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { useToast } from "../ui/use-toast";
import { deleteVinyl, updateVinyl } from "./actions";

import slugify from "slugify";

export function useUpdateVinyl() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const router = useRouter()

  return useMutation({
    mutationFn: updateVinyl,
    // Optimistically update the cache before the server responds
    onMutate: async (variables) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["vinyl", variables.id] })

      // Snapshot the previous value
      const previousVinyl = queryClient.getQueryData(["vinyl", variables.id])

      // Optimistically update to the new value
      queryClient.setQueryData(["vinyl", variables.id], (old: VinylData | undefined) => {
        // If no previous data, return the new values
        if (!old) return undefined

        return {
          ...old,
          artist: variables.artist,
          album: variables.album,
          genreId: variables.genreId,
          hashtags: variables.hashtags,
          // Make sure to update the genre object if needed
          genre: {
            ...old.genre,
            id: variables.genreId,
          },
          // Safely handle attachments
          attachments: variables.mediaIds.map((id) => {
            // Try to find existing attachment
            const existing = old.attachments.find((a) => a.id === id)
            if (existing) return existing

            // If it's a new attachment, create a placeholder
            return {
              id,
              url: "", // This will be updated when the server responds
              type: "IMAGE", // Default type
            }
          }),
        }
      })

      // Return a context object with the snapshotted value
      return { previousVinyl }
    },
    onSuccess: (updatedVinyl, variables) => {

      // Force update the cache with the server response
      queryClient.setQueryData(["vinyl", variables.id], updatedVinyl)

      // Invalidate and refetch all related queries
      queryClient.invalidateQueries({ queryKey: ["vinyl", variables.id] })
      queryClient.invalidateQueries({ queryKey: ["vinyls"] })
      queryClient.invalidateQueries({ queryKey: ["vinyl-feed"] })

      // Force a refetch of the specific vinyl
      queryClient.refetchQueries({ queryKey: ["vinyl", variables.id] })

      toast({
        title: "Vinyl updated",
        description: "Your vinyl has been updated successfully.",
      })

        const vinylArtist = slugify(variables.artist, { lower: true, strict: true });
        const vinylAlbum = slugify(variables.album, { lower: true, strict: true });
      

      // Navigate after a short delay to ensure cache is updated
      setTimeout(() => {
        router.push(`/vinyls/${vinylArtist}/${vinylAlbum}/${variables.id}`)
        // Force a refresh of the page
        router.refresh()
      }, 100)
    },
    onError: (error, variables, context) => {
      console.error("Error updating vinyl:", error)

      // If the mutation fails, roll back to the previous state
      if (context?.previousVinyl) {
        queryClient.setQueryData(["vinyl", variables.id], context.previousVinyl)
      }

      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update vinyl. Please try again.",
      })
    },
    onSettled: (data, error, variables) => {
      // Always refetch after error or success to ensure cache is up to date
      queryClient.invalidateQueries({ queryKey: ["vinyl", variables.id] })
    },
  })
}
export function useDeleteVinylMutation() {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  const router = useRouter();
  const pathname = usePathname();

  const mutation = useMutation({
    mutationFn: deleteVinyl,
    onSuccess: async (deletedVinyl) => {
      const queryFilter: QueryFilters = { queryKey: ["vinyl-feed"] };

      await queryClient.cancelQueries(queryFilter);

      queryClient.setQueriesData<InfiniteData<VinylsPage, string | null>>(
        queryFilter,
        (oldData) => {
          if (!oldData) return;

          return {
            pageParams: oldData.pageParams,
            pages: oldData.pages.map((page) => ({
              nextCursor: page.nextCursor,
              vinyls: page.vinyls.filter((p) => p.id !== deletedVinyl.id),
            })),
          };
        },
      );
      toast({
        description: "Vinyl deleted",
      });

      // if (pathname === `/vinyls/${deletedVinyl.id}`) {
        router.push(`/users/${deletedVinyl.user.username}`);
      // }
    },
    onError(error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Failed to delete vinyl. Please try again.",
      });
    },
  });

  return mutation;
}