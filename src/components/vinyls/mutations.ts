import { VinylsPage } from "@/lib/types";
import {
  InfiniteData,
  QueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { useToast } from "../ui/use-toast";
import { deleteVinyl } from "./actions";

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

<<<<<<< HEAD
      toast({
        description: "Vinyl deleted",
      });
=======
      // console.log('deleted')
      // toast({
      //   description: "Post deleted",
      // });
>>>>>>> bf5a12cd96ffe31dc95ad6c956620ceb4ab5a368

      // if (pathname === `/posts/${deletedVinyl.id}`) {
      //   router.push(`/users/${deletedVinyl.user.username}`);
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