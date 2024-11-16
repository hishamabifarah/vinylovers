import { useToast } from "@/components/ui/use-toast";
import { VinylsPage } from "@/lib/types";
import { useSession } from "../../home/SessionProvider";

import {
  InfiniteData,
  QueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { submitVinyl } from "./actions";
import { NewVinylValues } from "@/lib/validation";

export function useSubmitVinylMutation() {

  const { toast } = useToast();

  const queryClient = useQueryClient();

  // const { user } = useSession()
  
  // mutationFn: ({ id, variables }: { id: number, variables: UpdateCustomerType }) => updateCustomer(id, variables),

  const mutation = useMutation({
    // mutationFn: ({ values }: { values: NewVinylValues}) => submitVinyl(values),
    mutationFn: (values: NewVinylValues) => submitVinyl(values),
    onSuccess: async (newVinyl) => {

      // const queryFilter: QueryFilters = { queryKey: ["post-feed", "for-you"] };

      const queryFilter = {
        queryKey: ["vinyl-feed"],
        predicate(query) {
          return ( // for new post to show in the feed and right away on the profile page without waiting even if for ms
            query.queryKey.includes("for-you") ||
            (query.queryKey.includes("user-vinyls") )
            
            // &&
            //   query.queryKey.includes(user.id))
          );
        },
      } satisfies QueryFilters; // satisfies tells nextjs that we can we use 2 predicates and we asset their type (which we added in  queryClient.invalidateQueries({)

      // stop any running queries so we dont get bugs, bug:if we mutate cache and load next page into it
      await queryClient.cancelQueries(queryFilter);

      // Queries not Query because we wnat to put the post in multiple pages
      queryClient.setQueriesData<InfiniteData<VinylsPage, string | null>>(
        queryFilter,
        // function which recieves the old data
        // oldData is all the pages of posts we have loaded
        (oldData) => {
            
          const firstPage = oldData?.pages[0];
          if (firstPage) {
            return {
              pageParams: oldData.pageParams,
              pages: [
                {
                  vinyls: [newVinyl, ...firstPage.vinyls],
                  nextCursor: firstPage.nextCursor,
                },
                ...oldData.pages.slice(1),
              ],
            };
          }
        },
      );

      // rare case when we dont have data fetched (1st page) we invalidatethequery only if we dont have a page yet
      queryClient.invalidateQueries({
        queryKey: queryFilter.queryKey,
        // predicate(query) {
        //   return !query.state.data; // no data in query
        // },
        predicate(query) {
          // return queryFilter.predicate(query) && !query.state.data;
          return !query.state.data;
        },
      });

      toast({
        description: "Vinyl created",
      });
    },
    onError(error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Failed to post. Please try again.",
      });
    },
  });

  return mutation;
}