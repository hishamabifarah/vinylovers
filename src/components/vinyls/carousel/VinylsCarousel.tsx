"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import useEmblaCarousel from "embla-carousel-react"
import { ChevronLeft, ChevronRight } from "lucide-react"

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
  const [currentIndex, setCurrentIndex] = useState(0)
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
  })

  // Force re-render when index changes to update background
  const [key, setKey] = useState(0)

  // Update current index when slide changes
  const onSelect = useCallback(() => {
    if (!emblaApi) return

    const newIndex = emblaApi.selectedScrollSnap()
    if (newIndex !== currentIndex) {
      setCurrentIndex(newIndex)
      // Force re-render to update background
      setKey((prev) => prev + 1)

      console.log(
        `Slide changed to ${newIndex}, Background should update to: ${vinyls[newIndex]?.attachments[1]?.url?.slice(0, 30)}...`,
      )
    }
  }, [emblaApi, currentIndex, vinyls])

  // Initialize and cleanup embla carousel
  useEffect(() => {
    if (!emblaApi) return

    // Register all necessary event listeners
    emblaApi.on("select", onSelect)
    emblaApi.on("reInit", onSelect)

    // Initial call to set the correct index
    onSelect()

    return () => {
      emblaApi.off("select", onSelect)
      emblaApi.off("reInit", onSelect)
    }
  }, [emblaApi, onSelect])

  // Auto-slide functionality
  useEffect(() => {
    if (!emblaApi || vinyls.length <= 1) return

    const interval = setInterval(() => {
      emblaApi.scrollNext()
    }, 5000)

    return () => clearInterval(interval)
  }, [emblaApi, vinyls.length])

  // Manual navigation functions with debugging
  const scrollPrev = useCallback(() => {
    console.log("Previous button clicked")
    if (emblaApi) {
      emblaApi.scrollPrev()
      console.log("Scrolled to previous slide")
    } else {
      console.log("Embla API not available")
    }
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    console.log("Next button clicked")
    if (emblaApi) {
      emblaApi.scrollNext()
      console.log("Scrolled to next slide")
      console.log('backgroundImage' , backgroundImage)
    } else {
      console.log("Embla API not available")
    }
  }, [emblaApi])

  if (!vinyls.length) {
    return <div className="flex items-center justify-center h-[400px]">No vinyls found</div>
  }

  // Get current background image
  const currentVinyl = vinyls[currentIndex]
  const backgroundImage = currentVinyl?.attachments[1]?.url || "/placeholder.svg?height=1080&width=1920"

  return (
    <div className="relative w-full h-[600px] overflow-hidden" key={key}>
      {/* Background image - simpler approach */}
      <div className="absolute inset-0">
        <Image
          src={backgroundImage || "/placeholder.svg"}
          alt="Background"
          fill
          className="object-cover opacity-30"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
      </div>

      <div className="relative z-10 container mx-auto h-full flex items-center">
        {/* Navigation buttons outside the carousel */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 z-30">
          <button
            type="button"
            onClick={scrollPrev}
            className="bg-black/50 hover:bg-black/70 text-white rounded-full p-3 focus:outline-none"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        </div>

        <div className="absolute right-4 top-1/2 -translate-y-1/2 z-30">
          <button
            type="button"
            onClick={scrollNext}
            className="bg-black/50 hover:bg-black/70 text-white rounded-full p-3 focus:outline-none"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>

        <Carousel
          ref={emblaRef}
          className="w-full max-w-4xl mx-auto"
          opts={{
            loop: true,
            align: "center",
          }}
        >
          <CarouselContent>
            {vinyls.map((vinyl) => (
              <CarouselItem key={vinyl.id} className="basis-full">
                <Card className="bg-transparent border-none shadow-none">
                  <CardContent className="flex flex-col items-center p-6">
                    <div className="relative w-64 h-64 mb-6">
                      <Image
                        src={vinyl.thumbnail || vinyl.attachments[0]?.url || "/placeholder.svg?height=256&width=256"}
                        alt={`${vinyl.artist} - ${vinyl.album}`}
                        fill
                        className="object-cover rounded-lg shadow-lg"
                      />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">{vinyl.album}</h2>
                    <h3 className="text-xl text-gray-300 mb-2">{vinyl.artist}</h3>
                    <Badge variant="secondary" className="mb-2">
                      {vinyl.genre.name}
                    </Badge>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* Slide indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {vinyls.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all ${
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

