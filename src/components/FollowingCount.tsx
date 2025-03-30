"use client";

import useFollowingInfo from "@/hooks/useFollowingInfo";
import { FollowingInfo } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import Link from "next/link";

interface FollowingCountProps {
  userId: string;
  initialState: FollowingInfo;
}

export default function FollowingCount({
  userId,
  initialState,
}: FollowingCountProps) {
  const { data } = useFollowingInfo(userId, initialState);

  return (
    <span>
      <Link href={`${data.username}/following`}>
      Following:{" "}
      <span className="font-semibold">{formatNumber(data.following)}</span></Link>
    </span>
  );
}