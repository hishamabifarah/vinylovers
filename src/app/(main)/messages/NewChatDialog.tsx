"use client"

import LoadingButton from "@/components/LoadingButton"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import UserAvatar from "@/components/UserAvatar"
import useDebounce from "@/hooks/useDebounce"
import { useMutation, useQuery } from "@tanstack/react-query"
import { Check, Loader2, SearchIcon, UserCheck, Users, X } from "lucide-react"
import { useState } from "react"
import type { UserResponse } from "stream-chat"
import { type DefaultStreamChatGenerics, useChatContext } from "stream-chat-react"
import { useSession } from "../SessionProvider"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import kyInstance from "@/lib/ky"

interface NewChatDialogProps {
  onOpenChange: (open: boolean) => void
  onChatCreated: () => void
  initialSearchTerm?: string
}

export default function NewChatDialog({ onOpenChange, onChatCreated, initialSearchTerm = "" }: NewChatDialogProps) {
  const { client, setActiveChannel } = useChatContext()
  const { toast } = useToast()
  const { user: loggedInUser } = useSession()

  const [activeTab, setActiveTab] = useState<"all" | "mutual">("all")
  const [searchInput, setSearchInput] = useState(initialSearchTerm)
  const searchInputDebounced = useDebounce(searchInput)

  const [selectedUsers, setSelectedUsers] = useState<UserResponse<DefaultStreamChatGenerics>[]>([])

  // Query for all users
  const allUsersQuery = useQuery({
    queryKey: ["stream-users", searchInputDebounced, "all"],
    queryFn: async () =>
      client.queryUsers(
        {
          id: { $ne: loggedInUser!.id },
          role: { $ne: "admin" },
          ...(searchInputDebounced
            ? {
                $or: [
                  { name: { $autocomplete: searchInputDebounced } },
                  { username: { $autocomplete: searchInputDebounced } },
                ],
              }
            : {}),
        },
        { name: 1, username: 1 },
        { limit: 15 },
      ),
    enabled: activeTab === "all",
  })

  // Query for mutual followers
  const mutualFollowersQuery = useQuery({
    queryKey: ["mutual-followers", searchInputDebounced],
    queryFn: async () => {
      const url = new URL("/api/users/mutual-followers", window.location.origin)

      if (searchInputDebounced) {
        url.searchParams.set("q", searchInputDebounced)
      }

      const mutualFollowers = await kyInstance.get(url.toString()).json<any[]>()

      // Convert to format compatible with Stream users
      return {
        users: mutualFollowers.map((user) => ({
          id: user.id,
          name: user.displayName || user.username,
          username: user.username,
          image: user.avatarUrl,
        })),
      }
    },
    enabled: activeTab === "mutual",
  })

  // Use the appropriate query based on active tab
  const { data, isFetching, isError, isSuccess } = activeTab === "all" ? allUsersQuery : mutualFollowersQuery

  const mutation = useMutation({
    mutationFn: async () => {
      const channel = client.channel("messaging", {
        members: [loggedInUser!.id, ...selectedUsers.map((u) => u.id)],
        name:
          selectedUsers.length > 1
            ? loggedInUser!.displayName + ", " + selectedUsers.map((u) => u.name).join(", ")
            : undefined,
      })
      await channel.create()
      return channel
    },
    onSuccess: (channel) => {
      setActiveChannel(channel)
      onChatCreated()
    },
    onError(error) {
      console.error("Error starting chat", error)
      toast({
        variant: "destructive",
        description: "Error starting chat. Please try again.",
      })
    },
  })

  return (
    <Dialog open onOpenChange={onOpenChange}>
      <DialogContent className="p-0">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>New chat</DialogTitle>
        </DialogHeader>
        <div>
          <Tabs
            defaultValue="all"
            value={activeTab}
            onValueChange={(value) => {
              setActiveTab(value as "all" | "mutual")
              // Don't clear search when switching tabs to preserve the initial search term
            }}
            className="w-full border-b border-b-muted/50 p-6 pt-4 pb-2"
          >
            <TabsList className="grid w-full grid-cols-1">
              {/* <TabsTrigger value="all" className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>All Users</span>
              </TabsTrigger> */}
              <TabsTrigger value="mutual" className="flex items-center gap-1">
                <UserCheck className="h-4 w-4" />
                <span>Mutual Followers</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="group relative">
            <SearchIcon className="absolute left-5 top-1/2 size-5 -translate-y-1/2 transform text-muted-foreground group-focus-within:text-primary" />
            <input
              placeholder={activeTab === "all" ? "Search users..." : "Search mutual followers..."}
              className="h-12 w-full pe-4 ps-14 focus:outline-none"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>

          {!!selectedUsers.length && (
            <div className="mt-4 flex flex-wrap gap-2 p-2">
              {selectedUsers.map((user) => (
                <SelectedUserTag
                  key={user.id}
                  user={user}
                  onRemove={() => {
                    setSelectedUsers((prev) => prev.filter((u) => u.id !== user.id))
                  }}
                />
              ))}
            </div>
          )}

          <hr />

          <div className="h-96 overflow-y-auto">
            {isSuccess &&
              data.users.map((user) => (
                <UserResult
                  key={user.id}
                  user={user}
                  selected={selectedUsers.some((u) => u.id === user.id)}
                  onClick={() => {
                    setSelectedUsers((prev) =>
                      prev.some((u) => u.id === user.id) ? prev.filter((u) => u.id !== user.id) : [...prev, user],
                    )
                  }}
                  isMutual={activeTab === "mutual"}
                />
              ))}

            {isSuccess && !data.users.length && (
              <p className="my-3 text-center text-muted-foreground">
                {activeTab === "all"
                  ? "No users found. Try a different name."
                  : "No mutual followers found. Try a different name or follow more users."}
              </p>
            )}

            {isFetching && <Loader2 className="mx-auto my-3 animate-spin" />}

            {isError && <p className="my-3 text-center text-destructive">An error occurred while loading users.</p>}
          </div>
        </div>

        <DialogFooter className="px-6 pb-6">
          <LoadingButton
            disabled={!selectedUsers.length}
            loading={mutation.isPending}
            onClick={() => mutation.mutate()}
          >
            Start chat
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

interface UserResultProps {
  user: UserResponse<DefaultStreamChatGenerics>
  selected: boolean
  onClick: () => void
  isMutual?: boolean
}

function UserResult({ user, selected, onClick, isMutual }: UserResultProps) {
  return (
    <button
      className="flex w-full items-center justify-between px-4 py-2.5 transition-colors hover:bg-muted/50"
      onClick={onClick}
    >
      <div className="flex items-center gap-2">
        <UserAvatar avatarUrl={user.image} />
        <div className="flex flex-col text-start">
          <div className="flex items-center gap-1">
            <p className="font-bold">{user.name}</p>
            {isMutual && <UserCheck className="h-4 w-4 text-primary"  />}
          </div>
          <p className="text-muted-foreground">@{user.username}</p>
        </div>
      </div>
      {selected && <Check className="size-5 text-green-500" />}
    </button>
  )
}

interface SelectedUserTagProps {
  user: UserResponse<DefaultStreamChatGenerics>
  onRemove: () => void
}

function SelectedUserTag({ user, onRemove }: SelectedUserTagProps) {
  return (
    <button onClick={onRemove} className="flex items-center gap-2 rounded-full border p-1 hover:bg-muted/50">
      <UserAvatar avatarUrl={user.image} size={24} />
      <p className="font-bold">{user.name}</p>
      <X className="mx-2 size-5 text-muted-foreground" />
    </button>
  )
}

