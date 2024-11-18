'use client'

import Image from 'next/image'
import { useQuery } from '@tanstack/react-query'

interface Genre {
  id: string
  name: string
  thumbnail: string
  vinylCount: number
}

async function fetchGenres(): Promise<Genre[]> {
  const response = await fetch('/api/genres')
  if (!response.ok) {
    throw new Error('Failed to fetch genres')
  }
  return response.json()
}

function GenreCard({ genre }: { genre: Genre }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="relative h-40 sm:h-48 md:h-56 lg:h-64">
        <Image
          src={genre.thumbnail}
          alt={genre.name}
          layout="fill"
          objectFit="cover"
          className="transition-transform duration-300 ease-in-out transform hover:scale-105"
        />
      </div>
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2">{genre.name}</h2>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {genre.vinylCount} vinyl{genre.vinylCount !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  )
}

export function GenreGrid() {
  const { data: genres, error, isLoading } = useQuery<Genre[]>({
    queryKey: ['genres'],
    queryFn: fetchGenres,
  })

  if (isLoading) return <div>Loading genres...</div>
  if (error) return <div>Error loading genres: {error.message}</div>
  if (!genres) return <div>No genres found</div>

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {genres.map((genre) => (
        <GenreCard key={genre.id} genre={genre} />
      ))}
    </div>
  )
}