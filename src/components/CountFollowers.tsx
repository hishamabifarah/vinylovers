"use client";

import useFollowingInfo from "@/hooks/useFollowingInfo";
import useInfoFollower from "@/hooks/useInfoFollower";
import { FollowersInfo } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import Link from "next/link";

interface FollowingCountProps {
  userId: string;
  initialState: FollowersInfo;
}

export default function CountFollowers({
  userId,
  initialState,
}: FollowingCountProps) {
  const { data } = useInfoFollower(userId, initialState);

  return (
    <span>
      <Link href={`${data.username}/followers`}>
      Followers:{" "}
      <span className="font-semibold">{formatNumber(data.followers)}</span></Link>
    </span>
  );
}