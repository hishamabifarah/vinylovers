"use client";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bookmark, Share2, Heart, MessageCircle } from "lucide-react";
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

interface VinylProps {
  id: string;
  artist: string;
  thumbnail: string | null;
  createdAt: Date;
  album: string;
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
  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-square">
        <Image
          src={vinyl.thumbnail || avatarPlaceholder}
          alt={`${vinyl.album} by ${vinyl.artist}`}
          layout="fill"
          objectFit="cover"
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black to-transparent p-1 sm:p-2">
          <h3 className="truncate text-xs sm:text-sm font-semibold text-white">
            {vinyl.album}
          </h3>
          <p className="truncate text-xs text-gray-300">{vinyl.artist}</p>
        </div>
      </div>
      <CardContent className="p-1 sm:p-2">
        <div className="flex flex-col">
          <div className="flex items-center space-x-1 sm:space-x-2">
            <Link href={`/users/${vinyl.user.username}`}>
              <UserAvatar avatarUrl={vinyl.user.avatarUrl} className="h-4 w-4 sm:h-6 sm:w-6" />
            </Link>
            <span className="text-xs text-muted-foreground truncate">
              {vinyl.user.username}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 sm:mt-1">
            {formatRelativeDate(vinyl.createdAt)}
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between p-1 sm:p-2">
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
      </CardFooter>
    </Card>
  );
}
