import Image from 'next/image'
import { Card , CardContent } from '../ui/card'

interface GenreCardProps {
  genre: {
    id: string
    name: string
    thumbnail: string
    vinylCount: number
  }
}

export function GenreCard({ genre }: GenreCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
            <Image
              src={genre.thumbnail}
              alt={`${genre.name} genre`}
              style={{objectFit:"cover"}}
              fill
            />
          </div>
          <div className="flex-grow min-w-0">
            <h2 className="text-lg font-semibold truncate" title={genre.name}>
              {genre.name}
            </h2>
            <p className="text-sm text-muted-foreground">
              {genre.vinylCount} vinyl{genre.vinylCount !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}