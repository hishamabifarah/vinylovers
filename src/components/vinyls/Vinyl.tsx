"use client";

import { formatRelativeDate } from "@/lib/utils";
import Link from "next/link";
import UserAvatar from "../UserAvatar";
import VinylMoreButton from "./VinylMoreButton";
import { useSession } from "@/app/(main)/SessionProvider";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bookmark, Share2, Heart, MessageCircle } from "lucide-react";
import { VinylData } from "@/lib/types";
import avatarPlaceholder from "@/assets/avatar-placeholder.png";
import { Badge } from "../ui/badge";
import { MediaGallery } from "./MediaGallery";
import LikeButton from "./LikeButton";

interface PostProps {
  vinyl: VinylData;
}

export default function Vinyl({ vinyl }: PostProps) {
  const { user } = useSession();

  const firstImageUrl = vinyl.attachments[0]?.type === "IMAGE" ? vinyl.attachments[0].url : null;
  const hashtags = vinyl.hashtags?.split(",").map((tag) => tag.trim());
  const images = vinyl.attachments.filter((a) => a.type === "IMAGE");
  const videos = vinyl.attachments.filter((a) => a.type === "VIDEO");

  return (
    <>
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
        <CardContent className="p-0">
          <div className="flex flex-col sm:flex-row">
            <div className="relative aspect-square w-full sm:w-56">
              <Image
                src={firstImageUrl || avatarPlaceholder}
                alt={`${vinyl.artist} by ${vinyl.artist}`}
                style={{ objectFit: "cover" }}
                fill
                className="transition-transform duration-300 hover:scale-105"
              />
            </div>
            <div className="flex flex-1 flex-col p-4">
              <div className="mb-2 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold leading-tight">
                    {vinyl.artist}
                  </h3>
                  <p className="text-sm text-muted-foreground">{vinyl.album}</p>
                </div>
                <span
                  className="text-xs text-muted-foreground"
                  suppressHydrationWarning
                >
                  {formatRelativeDate(vinyl.createdAt)}
                </span>
              </div>
              <Badge variant="secondary" className="mb-4 self-start">
                {vinyl.genre.name}
              </Badge>
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {hashtags?.map((tag, index) => (
                    <span
                      key={index}
                      className="rounded-full bg-secondary px-2 py-1 text-sm text-secondary-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-auto flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Link href={`/users/${vinyl.user.username}`}>
                    <UserAvatar avatarUrl={vinyl.user.avatarUrl} />
                  </Link>
                  <span className="text-sm font-medium">
                    {vinyl.user.username}
                  </span>
                </div>
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
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <MessageCircle className="mr-1 h-4 w-4" />
                    {/* {comments} */}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                  {vinyl.user.id === user?.id && (
                    <VinylMoreButton
                      vinyl={vinyl}
                      className="h-4 w-4 text-muted-foreground hover:text-foreground"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="mt-5">
        {(images.length > 1 || videos.length > 0) && (
          <div className="space-y-4">
            {images.length > 1 && (
              <div>
                <h2 className="mb-2 text-xl font-semibold">Images</h2>
                <MediaGallery items={images} type="IMAGE" />
              </div>
            )}
            {videos.length > 0 && (
              <div>
                <h2 className="mb-2 text-xl font-semibold">Videos</h2>
                <MediaGallery items={videos} type="VIDEO" />
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
