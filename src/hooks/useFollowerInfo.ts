import kyInstance from "@/lib/ky";
import { FollowerInfo } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

// created alone in hooks folder because we need to use it in different components 
// so we can apply optimistic update
// ie: when we follow a user the button will change to following in main page and profile page , count and following/notfollowing

export default function useFollowerInfo(
  userId: string,
  initialState: FollowerInfo,
) {
  const query = useQuery({
    queryKey: ["follower-info", userId], // each userId needs it own query key ('follower info')
    queryFn: () =>
      kyInstance.get(`/api/users/${userId}/followers`).json<FollowerInfo>(),
    initialData: initialState,
    staleTime: Infinity, // follow button does not automatiicaly revalidte unless we ask it to
  });

  return query;
}