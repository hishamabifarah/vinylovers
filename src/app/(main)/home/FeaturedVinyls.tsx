import { Suspense } from 'react'
import prisma from '@/lib/prisma'
import { unstable_cache } from 'next/cache'
import VinylsLoadingSkeleton from '@/components/vinyls/VinylsLoadingSkeleton'
import { FeaturedVinylsCard } from '@/components/vinyls/FeaturedVinylsCard';

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
  genre: {
    id: string;
    name: string;
  },
}

const getRandomVinyls = unstable_cache(
  async () => {
    const result = await prisma.$queryRaw<VinylProps[]>`
      SELECT 
        v.id,
        v.artist,
        v.thumbnail,
        v."createdAt",
        v.album,
        v."genreId",
        JSON_BUILD_OBJECT(
          'id', g.id,
          'name', g.name
        ) as genre,
        COALESCE(
          JSON_AGG(
            JSON_BUILD_OBJECT(
              'id', a.id,
              'url', a.url,
              'type', a.type
            )
          ) FILTER (WHERE a.id IS NOT NULL),
          '[]'::json
        ) as attachments
      FROM "vinyls" v
      LEFT JOIN "genres" g ON v."genreId" = g.id
      LEFT JOIN "vinyls_media" a ON v.id = a."vinylId"
      GROUP BY v.id, v.artist, v.thumbnail, v."createdAt", v.album, v."genreId", g.id, g.name
      ORDER BY RANDOM()
      LIMIT 6
    `;
    
    return result.map((vinyl) => ({
      id: vinyl.id,
      artist: vinyl.artist,
      thumbnail: vinyl.thumbnail,
      createdAt: vinyl.createdAt,
      album: vinyl.album,
      attachments: vinyl.attachments,
      genre: vinyl.genre,
    }));
  },
  ["vinyl-featured"],
  { 
    revalidate: 600, 
    tags: ['vinyl-featured']
  }
);

// const getRandomVinyls = unstable_cache(
//   async () => {
//     const vinylCount = await prisma.vinyl.count()
//     const skip = Math.max(0, Math.floor(Math.random() * (vinylCount - 6)))

//     return await prisma.vinyl.findMany({
//       take: 6,
//         orderBy: {
//         // @ts-ignore
//         random: true // Only works in PostgreSQL
//       },
//       skip: skip,
//       select: {
//         id: true,
//         artist: true,
//         thumbnail: true,
//         album: true,
//         createdAt: true,
//         attachments: true,
//         genre: {
//           select: {
//             id: true,
//             name: true
//           }
//         },
//       },
//     })
//   },
//   ["vinyl-featured"],
//   { 
//     revalidate: 600, 
//     tags: ['vinyl-featured'] // Add tags
//   }
// )
export default async function RandomVinylsPage() {
  const randomVinyls = await getRandomVinyls()

  return (
    <div className="mt-4 lg:col-span-2">
      <h1 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
        Featured Vinyls
      </h1>
      <div className=" mx-auto  py-2">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {randomVinyls.map((vinyl) => (
            <Suspense
              key={vinyl.id}
              fallback={<VinylsLoadingSkeleton />}>
              <FeaturedVinylsCard vinyl={vinyl} />
            </Suspense>
          ))}
        </div>
      </div>
    </div>
  );
}