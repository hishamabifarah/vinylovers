"use client"

import { useMutualFollowers } from "@/hooks/useMutualFollowers"
import { Input } from "@/components/ui/input"
import { Loader2, Search, UserCheck } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"

export default function MutualFollowersList() {
  const { mutualFollowers, isLoading, error, searchInput, setSearchInput } = useMutualFollowers()

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search mutual followers..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="text-center py-8 text-destructive">An error occurred while loading mutual followers.</div>
      ) : mutualFollowers.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          {searchInput ? "No mutual followers found matching your search." : "You don't have any mutual followers yet."}
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-muted-foreground">
            <UserCheck className="h-4 w-4" />
            <span>Users who follow you back</span>
          </div>

          {mutualFollowers.map((user) => (
            <Card key={user.id} className="overflow-hidden">
              <CardContent className="p-0">
                <Link
                  href={`/users/${user.username}`}
                  className="flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="relative h-12 w-12 overflow-hidden rounded-full">
                    <Image
                      src={user.avatarUrl || "/placeholder.svg?height=48&width=48"}
                      alt={user.displayName || user.username}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{user.displayName || user.username}</p>
                    <p className="text-sm text-muted-foreground">@{user.username}</p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">{user._count.followers}</span> followers
                  </div>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

