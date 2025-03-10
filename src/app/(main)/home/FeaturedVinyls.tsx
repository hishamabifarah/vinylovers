import { Suspense } from 'react'
import prisma from '@/lib/prisma'
import { unstable_cache } from 'next/cache'
import VinylsLoadingSkeleton from '@/components/vinyls/VinylsLoadingSkeleton'
import { FeaturedVinylsCard } from '@/components/vinyls/FeaturedVinylsCard'

const getRandomVinyls = unstable_cache(
  async () => {
    const vinylCount = await prisma.vinyl.count()
    const skip = Math.max(0, Math.floor(Math.random() * (vinylCount - 8)))
    
    return await prisma.vinyl.findMany({
      take: 8,
      skip: skip,
      select: {
        id: true,
        artist: true,
        thumbnail: true,
        album: true,
        createdAt: true,
        attachments: true,
        genre: {
          select: {
            id: true,
            name: true
          }
        },
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
      <h1 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
        Featured Vinyls
      </h1>
      <div className=" mx-auto  py-8">
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {randomVinyls.map((vinyl) => (
          <Suspense
            key={vinyl.id}
            fallback={ <VinylsLoadingSkeleton/> }>
            <FeaturedVinylsCard vinyl={vinyl} />
          </Suspense>
        ))}
      </div>
    </div>
    </div>
  );
}