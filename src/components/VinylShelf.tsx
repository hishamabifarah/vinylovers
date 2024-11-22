'use client'

import React from 'react'
import Image from 'next/image'
import avatarPlaceholder from "@/assets/avatar-placeholder.png";

interface Vinyl {
  id: string
  album: string
  artist: string
  thumbnail: string | null
}

interface VinylShelfProps {
  vinyls: Vinyl[]
}

export const VinylShelf: React.FC<VinylShelfProps> = ({ vinyls }) => {
  return (
    <div className="w-full overflow-hidden bg-card p-4">
      <div className="flex space-x-4 overflow-x-auto pb-4">
        {vinyls.map((vinyl) => (
          <div
            key={vinyl.id}
            className="flex-shrink-0 transition-transform hover:scale-105 duration-200"
          >
            <Image
               src={vinyl.thumbnail || avatarPlaceholder}
              alt={`${vinyl.album} by ${vinyl.artist}`}
              width={150}
              height={150}
              className="rounded-md shadow-lg"
            />
          </div>
        ))}
      </div>
    </div>

      )
    }
