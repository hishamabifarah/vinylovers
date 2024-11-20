"use client"
import Image from 'next/image'
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bookmark, Share2, Heart, MessageCircle} from 'lucide-react'
import { formatRelativeDate } from "@/lib/utils";
import { UserData, VinylData, VinylFeaturedData } from '@/lib/types'
import Link from 'next/link'
import UserAvatar from '../UserAvatar'
import avatarPlaceholder from "@/assets/avatar-placeholder.png";
import { Badge } from '../ui/badge'

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
    <>
    
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
    <CardContent className="p-0">
      <div className="flex flex-col sm:flex-row">
        <div className="relative aspect-square w-full sm:w-56">
          <Image
              src={vinyl.thumbnail || avatarPlaceholder}
              alt={`${vinyl.artist} by ${vinyl.artist}`}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-300 hover:scale-105"
          />
        </div>
        <div className="flex flex-col flex-1 p-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-lg font-semibold leading-tight">{vinyl.artist}</h3>
              <p className="text-sm text-muted-foreground">{vinyl.album}</p>
            </div>
            <span className="text-xs text-muted-foreground">
            {formatRelativeDate(vinyl.createdAt)}
            </span>
          </div>
          <Badge variant="secondary" className="self-start mb-4">
            {'Metal'}
          </Badge>
          <div className="mt-auto flex items-center justify-between">
            <div className="flex items-center space-x-2">
            <Link href={`/users/${vinyl.user.username}`}>
                  <UserAvatar avatarUrl={vinyl.user.avatarUrl} />
                </Link>
              <span className="text-sm font-medium">{vinyl.user.username}</span>
            </div>
            <div className="flex space-x-2">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                <Heart className="h-4 w-4 mr-1" />
                {/* {likes} */}
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                <MessageCircle className="h-4 w-4 mr-1" />
                {/* {comments} */}
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>

  </>
  );
}