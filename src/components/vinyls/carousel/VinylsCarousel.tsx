"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
// import { ChevronLeft, ChevronRight } from "lucide-react"
import type { EmblaOptionsType } from "embla-carousel"
import useEmblaCarousel from "embla-carousel-react"

interface Attachment {
  url: string
  type: string
}

interface Genre {
  id: string
  name: string
}

interface VinylWithDetails {
  id: string
  artist: string
  album: string
  thumbnail: string | null
  hashtags: string | null
  attachments: Attachment[]
  genre: Genre
}

interface VinylCarouselProps {
  vinyls: VinylWithDetails[]
}

export function VinylCarousel({ vinyls }: VinylCarouselProps) {
  // Simple state for current index
  const [currentIndex, setCurrentIndex] = useState(0)

  // Adjusted Embla options for slower transitions
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    duration: 20, // Slower animation (higher number = slower)

  })

  // Get current background image
  const backgroundImage = vinyls[currentIndex]?.attachments[1]?.url || "/placeholder.svg?height=1080&width=1920"

  // Simple index update on slide change
  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setCurrentIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  // Initialize carousel
  useEffect(() => {
    if (!emblaApi) return
    emblaApi.on("select", onSelect)
    return () => {
      emblaApi.off("select", onSelect)
    }
  }, [emblaApi, onSelect])

  // Auto-slide functionality - simple implementation
  useEffect(() => {
    if (!emblaApi || vinyls.length <= 1) return
    const interval = setInterval(() => emblaApi.scrollNext(), 10000)
    return () => clearInterval(interval)
  }, [emblaApi, vinyls.length])

  // Simple navigation functions
  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  // Handle empty state
  if (!vinyls.length) {
    return <div className="flex items-center justify-center h-[400px]">No vinyls found</div>
  }

  return (
    <div className="relative w-full h-[600px] overflow-hidden bg-black">
      {/* Background image */}
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.3,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
      </div>

      <div className="relative z-10 container mx-auto h-full flex flex-col justify-center">
        {/* Carousel */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {vinyls.map((vinyl) => (
              <div key={vinyl.id} className="flex-[0_0_100%] min-w-0">
                <div className="flex flex-col items-center p-6">
                  <div className="relative w-64 h-64 mb-6 overflow-hidden rounded-lg shadow-lg">
                    <Image
                      src={vinyl.thumbnail || vinyl.attachments[0]?.url || "/placeholder.svg?height=256&width=256"}
                      alt={`${vinyl.artist} - ${vinyl.album}`}
                      fill
                      className="object-cover"
                      priority
                      sizes="256px"
                    />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">{vinyl.album}</h2>
                  <h3 className="text-xl text-gray-300 mb-2">{vinyl.artist}</h3>
                  <Badge variant="secondary" className="mb-2">
                    {vinyl.genre.name}
                  </Badge>
                  {/* {vinyl.hashtags && (
                    <div className="flex flex-wrap justify-center gap-2 mt-2">
                      {vinyl.hashtags.split(",").map((tag, index) => (
                        <Badge key={index} variant="outline">
                          {tag.trim()}
                        </Badge>
                      ))}
                    </div>
                  )} */}
                </div>
              </div>
            ))}
          </div>
        </div>


        {/* Slide indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {vinyls.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex ? "bg-white w-6" : "bg-white/50"
              }`}
              onClick={() => emblaApi?.scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}