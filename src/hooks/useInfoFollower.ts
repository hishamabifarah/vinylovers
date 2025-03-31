import kyInstance from "@/lib/ky";
import { FollowersInfo } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";


export default function useInfoFollower(
  userId: string,
  initialState: FollowersInfo,
) {

  return useQuery({
    queryKey: ["follower-info", userId],
    queryFn: async () => {
      const response = await kyInstance
        .get(`/api/users/${userId}/followers-user`)
        .json<FollowersInfo>();
      return response;
    },
    initialData: initialState,
    select: (data) => ({
      ...data,
      username: data.username || initialState.username, // Fallback to initialState.username
    }),
  });
}