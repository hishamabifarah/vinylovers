import { useToast } from "@/components/ui/use-toast";
import { VinylsPage } from "@/lib/types";
import { useUploadThing } from "@/lib/uploadthing";
import { UpdateUserProfileValues } from "@/lib/validation";
import {
  InfiniteData,
  QueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { updateUserProfile } from "./actions";

export function useUpdateProfileMutation() {
  const { toast } = useToast();

  const router = useRouter();

  // to update the reactquery cache after we update the user
  const queryClient = useQueryClient();

  // start the upload to uploadthing, "avatar" is the endpoint from core.ts
  const { startUpload: startAvatarUpload } = useUploadThing("avatar");

  const mutation = useMutation({
    mutationFn: async ({
      values, // userprofile values
      avatar, // avatar for user
    }: {
      values: UpdateUserProfileValues;
      avatar?: File;
    }) => {
      return Promise.all([
        updateUserProfile(values),
        avatar && startAvatarUpload([avatar]), // if avatar start uploading , [avatar] with [] from uploadthing
      ]);
    },
    // mutate the cache so all posts by user will have the new avatar
    // receives what we return from mutationFn : updatedUser is returned from updateUserProfile action 
    // and uploadResult comes from startAvatarUpload()
    // uploadResult can be undefinied because user might not upload an image
    onSuccess: async ([updatedUser, uploadResult]) => { 
      const newAvatarUrl = uploadResult?.[0].serverData.avatarUrl;

      const queryFilter: QueryFilters = {
        queryKey: ["vinyl-feed"],
      };

      // cancel running queries
      await queryClient.cancelQueries(queryFilter);

      queryClient.setQueriesData<InfiniteData<VinylsPage, string | null>>(
        queryFilter,
        (oldData) => {
          if (!oldData) return;

          return {
            pageParams: oldData.pageParams,
            pages: oldData.pages.map((page) => ({
              nextCursor: page.nextCursor,
              vinyls: page.vinyls.map((vinyl) => {
                if (vinyl.user.id === updatedUser.id) { // update the vinyls only if it;s the vinyl of the updated user
                  return {
                    ...vinyl,
                    user: { // we only care about the updateduser so we spread the vinyl information and updat user 
                      ...updatedUser,
                      avatarUrl: newAvatarUrl || updatedUser.avatarUrl, // if uploaded image set avatarURl to newAvatarUrl else keep the same user avatar
                    },
                  };
                }
                return vinyl; // case if not updateduser vinyl just return the vinyl
              }),
            })),
          };
        },
      );

      router.refresh(); // update the server component with the latest data , which is the user profile section
      //because it's just a small section so no heavy db operation we dont need to use reactquery 

      toast({
        description: "Profile updated",
      });
    },
    onError(error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Failed to update profile. Please try again.",
      });
    },
  });

  return mutation;
}