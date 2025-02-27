
import { MediaGallery } from "./MediaGallery"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button";
import { Bookmark, Share2, Heart, CalendarCheck, Music } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import UserAvatar from "../UserAvatar";
import avatarPlaceholder from "@/assets/avatar-placeholder.png";
import { formatRelativeDate } from "@/lib/utils";

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
    hashtags: string | null;
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

export function VinylDetails({ vinyl }: VinylCardProps) {

  const images = vinyl.attachments.filter((a) => a.type === "IMAGE")
  const videos = vinyl.attachments.filter((a) => a.type === "VIDEO")
  const hashtags = vinyl.hashtags?.split(",").map((tag) => tag.trim())
  const firstImageUrl =
    vinyl.attachments[0]?.type === "IMAGE" ? vinyl.attachments[0].url : null;

  return (
    <>
    <Card className="overflow-hidden">
      <div className="md:flex">
        <CardContent className="md:w-2/3 p-6">
          <h1 className="text-3xl font-bold mb-4">{vinyl.album}</h1>
          <div className="space-y-2 mb-4">
            <p>
              <span className="font-semibold">Artist:</span> {vinyl.artist}
            </p>
            <p>
              <span className="font-semibold">Genre:</span> {vinyl.genre.name}
            </p>

          </div>
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Hashtags</h2>
            <div className="flex flex-wrap gap-2">
              {hashtags?.map((tag, index) => (
                <span key={index} className="bg-secondary text-secondary-foreground px-2 py-1 rounded-full text-sm">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </CardContent>
      </div>
      <CardFooter className="flex flex-col items-start p-6 pt-0 space-y-4">
        <div className="flex items-center space-x-4">
        <UserAvatar
              avatarUrl={vinyl.user.avatarUrl}
              className="h-8 w-8 sm:h-8 sm:w-8"
            />
            <Link href={`/users/${vinyl.user.username}`}>
              <span className="text-md truncate font-semibold text-muted-foreground">
                {vinyl.user.username}
              </span>
            </Link>
          <div>
            <p className="font-semibold">{vinyl.user.displayName}</p>
            <p className="text-sm text-muted-foreground">
            <CalendarCheck className="mr-1 h-3 w-3 sm:h-4 sm:w-4" suppressHydrationWarning />
            <Link href={`/vinyls/${vinyl.id}`}>
    
              {formatRelativeDate(vinyl.createdAt)}
            </Link>
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
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
        </div>
      </CardFooter>

    </Card>
    <div>
    {(images.length > 1 || videos.length > 0) && (
            <div className="space-y-4">
              {images.length > 1 && (
                <div>
                  <h2 className="text-xl font-semibold mb-2">Images</h2>
                  <MediaGallery items={images} type="IMAGE" />
                </div>
              )}
              {videos.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-2">Videos</h2>
                  <MediaGallery items={videos} type="VIDEO" />
                </div>
              )}
            </div>
          )}
    </div>
    </>
  )
}

