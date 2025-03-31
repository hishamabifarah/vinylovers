import MutualFollowersList from "../messages/components/MutualFollowersList"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Mutual Followers | Vinylovers",
  description: "View users who follow you back on Vinylovers",
}

export default function MutualFollowersPage() {
  return (
    <div className="container max-w-2xl">
      <h1 className="text-2xl font-bold ">Mutual Followers</h1>
      <MutualFollowersList />
    </div>
  )
}

