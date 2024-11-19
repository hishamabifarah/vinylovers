"use client"
import Image from 'next/image'
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bookmark, Share2, Heart } from 'lucide-react'
import { formatRelativeDate } from "@/lib/utils";
import { UserData, VinylData, VinylFeaturedData } from '@/lib/types'
import Link from 'next/link'
import UserAvatar from '../UserAvatar'
import avatarPlaceholder from "@/assets/avatar-placeholder.png";

// interface VinylProps {
//     vinyl: VinylFeaturedData;
//   
//   }

  interface VinylProps {
    id: string;
    artist: string;
    thumbnail: string | null;
    createdAt: Date;
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
      <CardContent className="p-0">
        <div className="relative aspect-square">
          <Image
            src={vinyl.thumbnail || avatarPlaceholder}
            alt={vinyl.artist}
            layout="fill"
            objectFit="cover"
          />
        </div>
      </CardContent>
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
        <Link href={`/users/${vinyl.user.username}`}>
            <UserAvatar avatarUrl={vinyl.user.avatarUrl} />
          </Link>
          <div className="flex-grow">
            <h2 className="text-lg font-semibold truncate" title={vinyl.artist}>
              {vinyl.artist}
            </h2>
            <p className="text-sm text-muted-foreground">
              {vinyl.user.displayName} • {formatRelativeDate(vinyl.createdAt)}
  
              {/* <Link
              href={`/posts/${vinyl.id}`}
              className="block text-sm text-muted-foreground hover:underline"
            >
              {formatRelativeDate(vinyl.createdAt)}
            </Link> */}
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <Button variant="ghost" size="icon">
          <Heart className="h-4 w-4" />
          <span className="sr-only">Like</span>
        </Button>
        <Button variant="ghost" size="icon">
          <Bookmark className="h-4 w-4" />
          <span className="sr-only">Bookmark</span>
        </Button>
        <Button variant="ghost" size="icon">
          <Share2 className="h-4 w-4" />
          <span className="sr-only">Share</span>
        </Button>
      </CardFooter>
    </Card>
  )
}