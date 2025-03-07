
import prisma from "@/lib/prisma";

export interface VinylWithDetails {
  id: string
  artist: string
  album: string
  userId: string
  genreId: string
  thumbnail: string | null
  hashtags: string | null
  createdAt: Date
  genre: {
    id: string
    name: string
  }
  attachments: {
    type: string
    url: string
  }[]
}

export interface Attachment {
  id: string;
  url: string;
  type: 'IMAGE' | 'VIDEO';
}

export interface Genre {
  id: string
  name: string
}

export interface Vinyl {
    id: string
    title: string
    artist: string
    year: number
    coverUrl: string | null
    createdAt: Date
    updatedAt: Date
    album: string
    thumbnail: string
    hashtags: string
    attachments: Attachment[]
      genre: Genre

  }
  
  /**
   * Get a specified number of random vinyl records from the database
   */
  export async function getRandomVinyls(count = 6): Promise<Vinyl[]> {
    try {
      // Fetch random vinyls using Prisma
      const vinyls = await prisma.$queryRaw<Vinyl[]>`
        SELECT * FROM "Vinyl"
        ORDER BY RANDOM()
        LIMIT ${count}
      `
  
      return vinyls
    } catch (error) {
      console.error("Failed to fetch random vinyls:", error)
      return []
    }
  }
  