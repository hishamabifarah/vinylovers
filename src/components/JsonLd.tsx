"use client"

import { useEffect } from "react"

interface MusicAlbumJsonLdProps {
  album: string
  artist: string
  releaseDate?: string
  genre?: string
  imageUrl: string
  url: string
}

export function MusicAlbumJsonLd({ album, artist, releaseDate, genre, imageUrl, url }: MusicAlbumJsonLdProps) {
  useEffect(() => {
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "MusicAlbum",
      name: album,
      byArtist: {
        "@type": "MusicGroup",
        name: artist,
      },
      ...(releaseDate && { datePublished: releaseDate }),
      ...(genre && { genre: genre }),
      image: imageUrl,
      url: url,
    }

    const script = document.createElement("script")
    script.type = "application/ld+json"
    script.innerHTML = JSON.stringify(jsonLd)
    document.head.appendChild(script)

    return () => {
      document.head.removeChild(script)
    }
  }, [album, artist, releaseDate, genre, imageUrl, url])

  return null
}

