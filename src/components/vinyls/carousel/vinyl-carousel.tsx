"use client"
import type { VinylWithDetails } from '../lib/Vinyl'
import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import useEmblaCarousel from "embla-carousel-react"
import { Vinyl } from "../lib/Vinyl"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface VinylCarouselProps {
  vinyls: VinylWithDetails[]
}

export function VinylCarousel({ vinyls }: VinylCarouselProps) {

  console.log('vinyl-carousel');
  const [currentIndex, setCurrentIndex] = useState(0)
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    containScroll: "trimSnaps",
  })

  // Update current index when slide changes
  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setCurrentIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

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

  // Manual navigation functions
  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  if (!vinyls.length) {
    return <div className="flex items-center justify-center h-[400px]">No vinyls found</div>
  }

  const currentVinyl = vinyls[currentIndex]
  const backgroundImage = currentVinyl?.attachments[1]?.url || "/placeholder.svg?height=1080&width=1920"

  return (
    <div className="relative w-full h-[600px] overflow-hidden">
      {/* Background image with fade transition */}
      <div className="absolute inset-0 transition-opacity duration-1000">
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
              <CarouselItem key={vinyl.id} className="md:basis-2/3 lg:basis-1/2">
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
                    {vinyl.hashtags && (
                      <div className="flex flex-wrap justify-center gap-2 mt-2">
                        {vinyl.hashtags.split(",").map((tag, index) => (
                          <Badge key={index} variant="outline">
                            {tag.trim()}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Custom navigation buttons that are more visible on mobile */}
          <button
            onClick={scrollPrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 md:p-3"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <button
            onClick={scrollNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 md:p-3"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
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
