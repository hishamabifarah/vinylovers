import { getRandomVinyls } from '../lib/Vinyl'
import { VinylCarousel } from './VinylsCarousel'

export async function VinylShowcase() {
  // Fetch 6 random vinyls from the database
  const vinyls = await getRandomVinyls(6)

  return (
    <div className="relative overflow-hidden rounded-xl h-[500px]">
      <VinylCarousel vinyls={vinyls} />
    </div>
  )
}