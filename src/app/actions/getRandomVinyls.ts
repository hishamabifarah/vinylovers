import prisma from "@/lib/prisma"

 interface VinylWithDetails {
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

export async function getRandomVinyls(): Promise<VinylWithDetails[]> {
  const vinyls = await prisma.vinyl.findMany({
    where: {
      attachments: {
        some: {},
      },
    },
    select: {
      id: true,
      artist: true,
      album: true,
      userId: true,
      genreId: true,
      thumbnail: true,
      hashtags: true,
      createdAt: true,
      genre: {
        select: {
          id: true,
          name: true,
        },
      },
      attachments: {
        select: {
          type: true,
          url: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 6,
  })

  // Filter vinyls with at least 2 attachments
  const vinylsWithTwoOrMoreAttachments = vinyls.filter((vinyl) => vinyl.attachments.length >= 1)

  // Shuffle the filtered vinyls and take 6
  const shuffled = vinylsWithTwoOrMoreAttachments.sort(() => 0.5 - Math.random())
  return shuffled.slice(0, 6) as VinylWithDetails[]
}
