"use client";

import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bookmark, Share2, Heart, CalendarCheck, Music } from "lucide-react";
import { formatRelativeDate } from "@/lib/utils";
import { UserData, VinylData, VinylFeaturedData } from "@/lib/types";
import Link from "next/link";
import UserAvatar from "../UserAvatar";
import avatarPlaceholder from "@/assets/avatar-placeholder.png";
import { Badge } from "../ui/badge";

// interface VinylProps {
//     vinyl: VinylFeaturedData;
//
//   }

export interface Attachment {
  id: string;
  url: string;
  type: "IMAGE" | "VIDEO";
}

interface VinylProps {
  id: string;
  artist: string;
  thumbnail: string | null;
  createdAt: Date;
  album: string;
  attachments: Attachment[];
  genre: {
    id: string;
    name: string;
  };
  user: {
    username: string;
    avatarUrl: string | null;
    displayName: string;
    id: string;
  };
}

interface VinylCardProps {
  vinyl: VinylProps;
}

export function VinylCard({ vinyl }: VinylCardProps) {
  const firstImageUrl =
    vinyl.attachments[0]?.type === "IMAGE" ? vinyl.attachments[0].url : null;

  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-square">
        <Image
          src={firstImageUrl || avatarPlaceholder}
          alt={`${vinyl.album} by ${vinyl.artist}`}
          fill
          style={{objectFit:"cover"}}
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black to-transparent p-1 sm:p-2">
          <h3 className="truncate text-xs font-semibold text-white sm:text-sm">
            {vinyl.album}
          </h3>
          <p className="truncate text-xs text-gray-300">{vinyl.artist}</p>
        </div>
      </div>
      <CardContent className="p-1 sm:p-2">
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
          <p className="mt-0.5 flex text-xs text-muted-foreground sm:mt-1">
          <CalendarCheck className="mr-1 h-3 w-3 sm:h-4 sm:w-4" suppressHydrationWarning />
            <Link href={`/vinyls/${vinyl.id}`}>
    
              {formatRelativeDate(vinyl.createdAt)}
            </Link>
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between p-1 sm:p-2">
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
        <div className="flex justify-end">
          <Button variant="ghost" size="icon" className="h-6 w-6 sm:h-8 sm:w-8">
            <Heart className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="sr-only">Like</span>
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6 sm:h-8 sm:w-8">
            <Bookmark className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="sr-only">Bookmark</span>
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6 sm:h-8 sm:w-8">
            <Share2 className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="sr-only">Share</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
