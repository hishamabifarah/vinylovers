'use client';

import { useState } from "react";
import { useSession } from "@/app/(main)/SessionProvider";
import { VinylData } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "../ui/badge";
import { MediaGallery } from "./MediaGallery";
import LikeButton from "./LikeButton";
import BookmarkButton from "./BookmarkButton";
import Comments from "../comments/Comments";
import UserAvatar from "../UserAvatar";
import VinylMoreButton from "./VinylMoreButton";
import { formatRelativeDate } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import avatarPlaceholder from "@/assets/avatar-placeholder.png";
import { Heart, MessageSquare, Share2 } from "lucide-react";
import { TwitterShare, WhatsappShare } from "react-share-kit";
import slugify from "slugify";

interface PostProps {
  vinyl: VinylData;
}

export default function Vinyl({ vinyl }: PostProps) {
  const { user } = useSession();
  const [showComments, setShowComments] = useState(true);
  const [commentsCount, setCommentsCount] = useState(vinyl._count.comments);
  const [showShareOptions, setShowShareOptions] = useState(false);

  const firstImageUrl =
    vinyl.attachments[0]?.type === "IMAGE" ? vinyl.attachments[0].url : null;
  const hashtags = vinyl.hashtags?.split(",").map((tag) => tag.trim());

  const hashtagsshare = vinyl.hashtags
    ?.split(",")
    .map((tag) => tag.trim().replace(/^#/, "")); // Remove any existing #

  const images = vinyl.attachments.filter((a) => a.type === "IMAGE");
  const videos = vinyl.attachments.filter((a) => a.type === "VIDEO");

    const vinylArtist = slugify(vinyl.artist, { lower: true, strict: true });
    const vinylAlbum = slugify(vinyl.album, { lower: true, strict: true });

  //   const genreHashtagsMap = {
  //     "Rock": ["ClassicRock", "RockVinyl"],
  //     "Metal": ["HeavyMetal", "MetalVinyl"],
  //     "Jazz": ["JazzVinyl", "NowPlayingJazz"],
  //     "Hip-Hop": ["HipHopVinyl", "RapRecords"], // Fixed from "hiphop" to "Hip-Hop"
  //     "Indie": ["IndieVinyl", "AlternativeMusic"],
  //     "Dance-Electronic": ["ElectronicVinyl", "Synthwave"], // Keeps hyphen
  //     "Blues": ["BluesVinyl", "SoulRecords"],
  //     "Reggae": ["ReggaeVinyl", "DubMusic"]
  //   };

  // const baseHashtags = ["VinylCommunity", "NowSpinning", "VinylRecords", "RecordCollection"];

  // // Match the vinyl genre while preserving exact key formatting
  // const genreHashtags = genreHashtagsMap[vinyl.genre.name] || []; 

  // const hashtagsfinal = [...baseHashtags, ...genreHashtags]
  //   .map((tag) => tag.replace(/^#/, "")); // Remove any existing #

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
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" // Responsive sizes
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

                  {user?.id && (
                    <div className="flex gap-3 mt-5">
                      <BookmarkButton
                        vinylId={vinyl.id}
                        initialState={{
                          isBookmarkedByUser: vinyl.bookmarks.some(
                            (bookmark) => bookmark.userId === user?.id
                          ),
                        }}
                      />
                      {vinyl.user.id === user?.id && (
                        <VinylMoreButton
                          vinyl={vinyl}
                          className="h-4 w-4 text-muted-foreground hover:text-foreground"
                        />
                      )}
                    </div>
                  )}
                </span>
              </div>
              <Link href={`/vinyls/genres/${vinyl.genre.name}/${vinyl.genre.id}`} className="mb-4">
                <Badge variant="secondary" className="mb-4 self-start">
                  {vinyl.genre.name}
                </Badge>
              </Link>
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {hashtags?.map((tag, index) => (
                    <Link
                      key={index}
                      href={`/hashtag/${tag.split("#")[1]}`}
                      className="block"
                    >
                      <span
                        key={index}
                        className="rounded-full bg-secondary px-2 py-1 text-sm text-secondary-foreground"
                      >
                        {tag}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
              <div className="mt-auto flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Link
                    href={`/users/${vinyl.user.username}`}
                    className="flex items-center space-x-2"
                  >
                    <UserAvatar avatarUrl={vinyl.user.avatarUrl} />
                    <span className="text-sm font-medium">
                      {vinyl.user.username}
                    </span>
                  </Link>
                </div>
                <div className="flex justify-between items-center mt-5">
                  <div className="flex items-center gap-5">
                    {!user ? (
                      <Link href={"/login"} className="flex items-center gap-2">
                        <button className="flex items-center gap-2">
                          <Heart className="size-5 hover:text-foreground" />
                        </button>
                      </Link>
                    ) : (
                      <LikeButton
                        vinylId={vinyl.id}
                        initialState={{
                          likes: vinyl._count.likes,
                          isLikedByUser: vinyl.likes.some(
                            (like) => like.userId === user?.id
                          ),
                        }}
                      />
                    )}

                    <CommentButton
                      commentsCount={commentsCount}
                      onClick={() => setShowComments(!showComments)}
                    />

                    {/* Share Button */}
                    <div className="relative">
                      <button
                        onClick={() => setShowShareOptions((prev) => !prev)}
                        className="flex items-center gap-2"
                      >
                        <Share2 className="size-5 hover:text-foreground" />
                      </button>
                      {showShareOptions && (
                        <div className="absolute bottom-full right-0 mb-2 w-12 bg-white shadow-lg rounded-md z-20">
                          <div className="flex flex-col p-2">
                            <TwitterShare
                              size={32}
                              className="flex items-center gap-2 p-2 hover:bg-gray-100 mb-4"
                              url={`https://vinylovers.net/vinyls/${vinylArtist}/${vinylAlbum}/${vinyl.id}`}
                              hashtags={hashtagsshare}
                              title={`🔥 Spinning now: ${vinyl.artist} – ${vinyl.album}\n\n📀🎶 Check it out on Vinylovers! 🎧 Join the vinyl community! @VinyloversApp`}
                            />
                            <WhatsappShare
                              size={32}
                              className="flex items-center gap-2 p-2 hover:bg-gray-100 mb-4"
                              url={`https://vinylovers.net/vinyls/${vinylArtist}/${vinylAlbum}/${vinyl.id}`}
                              title={`🔥 Spinning now: ${vinyl.artist} – ${vinyl.album}\n\n📀🎶 Check it out on Vinylovers! 🎧 Join the vinyl community! @VinyloversApp`}
                            >
                            </WhatsappShare>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {user && showComments && (
        <Comments vinyl={vinyl} setCommentsCount={setCommentsCount} />
      )}

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

interface CommentButtonProps {
  commentsCount: number;
  onClick: () => void;
}

function CommentButton({ commentsCount, onClick }: CommentButtonProps) {
  return (
    <button onClick={onClick} className="flex items-center gap-2">
      <MessageSquare className="size-5" />
      <span className="text-sm font-medium tabular-nums">
        {commentsCount}{" "}
      </span>
    </button>
  );
}