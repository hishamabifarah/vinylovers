import { Suspense } from 'react'
import { GenreGrid } from './GenreGrid'

export default function GenresPage() {
  return (
    <div className="container mx-auto px-4 py-4">
      <h1 className="text-2xl font-bold mb-4">All Genres</h1>
      <Suspense fallback={<div>Loading genres...</div>}>
        <GenreGrid />
      </Suspense>
    </div>
  )
}