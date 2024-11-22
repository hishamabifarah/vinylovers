import { Suspense } from 'react'
import prisma from '@/lib/prisma'
import { VinylCard } from '@/components/vinyls/VinylsCard'
import { unstable_cache } from 'next/cache'
import VinylsLoadingSkeleton from '@/components/vinyls/VinylsLoadingSkeleton'

const getRandomVinyls = unstable_cache(
  async () => {
    const vinylCount = await prisma.vinyl.count()
    const skip = Math.max(0, Math.floor(Math.random() * (vinylCount - 6)))
    
    return await prisma.vinyl.findMany({
      take: 6,
      skip: skip,
      select: {
        id: true,
        artist: true,
        thumbnail: true,
        album: true,
        createdAt: true,
        genre: {
          select: {
            id: true,
            name: true
          }
        },
        user: {
          select: {
            id: true,
            username : true,
            displayName : true,
            avatarUrl: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
  },
  ["vinyl-featured"],
  { revalidate: 600 } // 10 minutes in seconds
)

export default async function RandomVinylsPage() {
  const randomVinyls = await getRandomVinyls()

  return (
    <div className="mt-4 lg:col-span-2">
      <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
        Featured Vinyls
      </h2>
      <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-2 sm:gap-4">
        {randomVinyls.map((vinyl) => (
          <Suspense
            key={vinyl.id}
            fallback={ <VinylsLoadingSkeleton/> }>
            <VinylCard vinyl={vinyl} />
          </Suspense>
        ))}
      </div>
    </div>
    </div>
  );
}