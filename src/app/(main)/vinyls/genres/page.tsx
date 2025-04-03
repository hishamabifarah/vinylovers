import { Suspense } from 'react'
import prisma from "../../../../lib/prisma";
import { GenreCard } from '@/components/genres/GenreCard';
import { Metadata } from "next";
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Genres List",
};

async function getGenres() {
  const genres = await prisma.genre.findMany({
    select: {
      id: true,
      name: true,
      thumbnail: true,
      vinyls: {
        select: { id: true }
      }
    },
    orderBy: {
      name: 'asc'
    }
  })
  return genres.map(genre => ({
    ...genre,
    vinylCount: genre.vinyls.length
  }))
}


export default async function GenresPage() {
  const genres = await getGenres()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Music Genres</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {genres.map(genre => (
          <Suspense key={genre.id} fallback={<div className="h-24 bg-gray-200 rounded-lg animate-pulse"></div>}>
              <Link href={`/vinyls/genres/${genre.name}/${genre.id}`}>
            <GenreCard genre={genre}  />
            </Link>
          </Suspense>
        ))}
      </div>
    </div>
  )
}

export const revalidate = 3600 // Revalidate every hour