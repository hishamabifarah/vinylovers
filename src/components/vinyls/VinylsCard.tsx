"use client";

import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { CalendarCheck, Music } from "lucide-react";
import { formatRelativeDate } from "@/lib/utils";
import { VinylData } from "@/lib/types";
import Link from "next/link";
import UserAvatar from "../UserAvatar";
import avatarPlaceholder from "@/assets/avatar-placeholder.png";
import { Badge } from "../ui/badge";
import { useSession } from "@/app/(main)/SessionProvider";
import BookmarkButton from "./BookmarkButton";
import LikeButton from "./LikeButton";


interface PostProps {
  vinyl: VinylData;
}

export function VinylCard({ vinyl }: PostProps) {

  const { user } = useSession();

  const firstImageUrl =
    vinyl.attachments[0]?.type === "IMAGE" ? vinyl.attachments[0].url : null;

  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-square">
        <Image
          src={firstImageUrl || avatarPlaceholder}
          alt={`${vinyl.album} by ${vinyl.artist}`}
          fill
          style={{ objectFit: "cover" }}
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black to-transparent p-1 sm:p-2">
          <h3 className="truncate text-xs font-semibold text-white sm:text-sm">
            {vinyl.album}
          </h3>
          <p className="truncate text-xs text-gray-300">{vinyl.artist}</p>
        </div>
      </div>
      <CardContent className="p-2 sm:p-2">
        <div className="flex flex-col">
          <div className="mb-2 flex items-center space-x-1 sm:space-x-2">
            <UserAvatar
              avatarUrl={vinyl.user.avatarUrl}
              className="h-8 w-8 sm:h-8 sm:w-8"
            />
            <Link href={`/users/${vinyl.user.username}`}>
              <span className="text-md truncate font-semibold text-muted-foreground">
                {vinyl.user.username}
              </span>
            </Link>
          </div>
          <p className="mt-0.75 flex text-xs text-muted-foreground sm:mt-1 pl-1">
            <CalendarCheck className="mr-1 h-3 w-3 sm:h-4 sm:w-4" suppressHydrationWarning />
            <Link href={`/vinyls/${vinyl.id}`}>

              {formatRelativeDate(vinyl.createdAt)}
            </Link>
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between p-2 sm:p-2">
        <div className="flex justify-start">
          <Badge
            key={vinyl.genre.id}
            variant="secondary"
            className="flex items-center space-x-1"
          >
            <Music className="h-3 w-3" />
            <Link href={`/vinyls/genres/${vinyl.genre.id}`}>
              <span>{vinyl.genre.name}</span>
            </Link>
          </Badge>
        </div>

        {user && (
          <div className="flex justify-end">
            <div className="flex space-x-2">
              <LikeButton
                vinylId={vinyl.id}
                initialState={{
                  likes: vinyl._count.likes,
                  isLikedByUser: vinyl.likes.some(
                    (like) => like.userId === user?.id,
                  ),
                }}
              />
              <BookmarkButton
                vinylId={vinyl.id}
                initialState={{
                  isBookmarkedByUser: vinyl.bookmarks?.some(
                    (bookmark) => bookmark.userId === user?.id,
                  ),
                }}
              />
              {/* {vinyl.user.id === user?.id && (
            <VinylMoreButton
              vinyl={vinyl}
              className="h-4 w-4 text-muted-foreground hover:text-foreground"
            />
          )} */}
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
