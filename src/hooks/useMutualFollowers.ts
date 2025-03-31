"use client"

import { useQuery } from "@tanstack/react-query"
import kyInstance from "@/lib/ky"
import useDebounce from "./useDebounce"
import { useState } from "react"

interface MutualFollower {
  id: string
  username: string
  displayName: string
  avatarUrl: string | null
  _count: {
    followers: number
    following: number
  }
}

export function useMutualFollowers() {
  const [searchInput, setSearchInput] = useState("")
  const debouncedSearch = useDebounce(searchInput, 300)

  const {
    data: mutualFollowers,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["mutual-followers", debouncedSearch],
    queryFn: async () => {
      const url = new URL("/api/users/mutual-followers", window.location.origin)

      if (debouncedSearch) {
        url.searchParams.set("q", debouncedSearch)
      }

      return kyInstance.get(url.toString()).json<MutualFollower[]>()
    },
  })

  return {
    mutualFollowers: mutualFollowers || [],
    isLoading,
    error,
    searchInput,
    setSearchInput,
  }
}

