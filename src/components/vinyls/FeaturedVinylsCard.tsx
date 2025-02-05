"use client";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import avatarPlaceholder from "@/assets/avatar-placeholder.png";

export interface Attachment {
  id: string;
  url: string;
  type: 'IMAGE' | 'VIDEO';
}

interface VinylProps {
  id: string;
  artist: string;
  thumbnail: string | null;
  createdAt: Date;
  album: string;
  attachments: Attachment[];
  genre:{
    id: string;
    name: string;
  },
}

interface VinylCardProps {
  vinyl: VinylProps;
}

export function FeaturedVinylsCard({ vinyl }: VinylCardProps) {

  const firstImageUrl = vinyl.attachments[0]?.type === 'IMAGE' ? vinyl.attachments[0].url : null;
  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-square">
        <Image
          src={firstImageUrl || avatarPlaceholder}
          alt={`${vinyl.album} by ${vinyl.artist}`}
          layout="fill"
          objectFit="cover"
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black to-transparent p-1 sm:p-2">
          <h3 className="truncate text-xs font-semibold text-white sm:text-sm">
            {vinyl.album}
          </h3>
          <p className="truncate text-xs text-gray-300">{vinyl.artist}</p>
        </div>
      </div>
    </Card>
  );
}