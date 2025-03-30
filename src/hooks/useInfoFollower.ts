import kyInstance from "@/lib/ky";
import { FollowersInfo } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";


export default function useFollowersinfo(
  userId: string,
  initialState: FollowersInfo,
) {

  const query = useQuery({
    queryKey: ["followers-info", userId], 
    queryFn: () =>
      kyInstance.get(`/api/users/${userId}/follower`).json<FollowersInfo>(),
    initialData: initialState,
    staleTime: Infinity, 
  });
  

  return query;
}