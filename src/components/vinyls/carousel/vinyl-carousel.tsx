"use client"
import type { VinylWithDetails } from '../lib/Vinyl'
import { useState, useEffect } from "react"
import Image from "next/image"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import useEmblaCarousel from "embla-carousel-react"
import { Vinyl } from "../lib/Vinyl"

interface VinylCarouselProps {
  vinyls: VinylWithDetails[]
}
export function VinylCarousel({ vinyls }: VinylCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })
  
    useEffect(() => {
      if (emblaApi) {
        const onSelect = () => {
          setCurrentIndex(emblaApi.selectedScrollSnap())
        }
        emblaApi.on("select", onSelect)
        return () => {
          emblaApi.off("select", onSelect)
        }
      }
    }, [emblaApi])
  
    useEffect(() => {
      const interval = setInterval(() => {
        if (emblaApi) emblaApi.scrollNext()
      }, 5000)
  
      return () => clearInterval(interval)
    }, [emblaApi])
  
    const currentVinyl = vinyls[currentIndex]
    const backgroundImage = currentVinyl?.attachments[1]?.url || "/placeholder.svg?height=1080&width=1920"
  
    return (
      <div className="relative w-full h-[600px] overflow-hidden">
        <Image
          src={backgroundImage || "/placeholder.svg"}
          alt="Background"
          fill
          className="object-cover opacity-30"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
        <div className="relative z-10 container mx-auto h-full flex items-center">
          <Carousel ref={emblaRef} className="w-full max-w-4xl mx-auto">
            <CarouselContent>
              {vinyls.map((vinyl) => (
                <CarouselItem key={vinyl.id}>
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
                      {/* {vinyl.hashtags && (
                        <div className="flex flex-wrap justify-center gap-2 mt-2">
                          {vinyl.hashtags.split(",").map((tag, index) => (
                            <Badge key={index} variant="outline">
                              {tag.trim()}
                            </Badge>
                          ))}
                        </div>
                      )} */}
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </div>
    )
  }
  