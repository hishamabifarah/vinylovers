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
  // State for loading status
  const [imagesLoaded, setImagesLoaded] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Carousel options
  const options: EmblaOptionsType = {
    loop: true,
    align: "center",
    containScroll: false,
    dragFree: false,
    duration: 7, // Slower animation
    slidesToScroll: 1,
    watchDrag: false, // Disable dragging/swiping
  }

  // Set up Embla carousel
  const [emblaRef, emblaApi] = useEmblaCarousel(options)

  // State for current slide index
  const [currentIndex, setCurrentIndex] = useState(0)

  // Get current background image
  const backgroundImage = vinyls[currentIndex]?.attachments[1]?.url || "/placeholder.svg?height=1080&width=1920"

  // Preload all images before showing the carousel
  useEffect(() => {
    let loadedCount = 0
    const totalImages = vinyls.length * 2 // Cover + background for each vinyl

    // Function to increment loaded count and check if all images are loaded
    const imageLoaded = () => {
      loadedCount++
      if (loadedCount >= totalImages) {
        setImagesLoaded(true)
      }
    }

    // Preload all vinyl images
    vinyls.forEach((vinyl) => {
      // Preload cover image
      const coverImg = document.createElement("img")
      coverImg.onload = imageLoaded
      coverImg.onerror = imageLoaded // Count errors as loaded to prevent hanging
      coverImg.src = vinyl.thumbnail || vinyl.attachments[0]?.url || "/placeholder.svg?height=256&width=256"

      // Preload background image
      const bgImg = document.createElement("img")
      bgImg.onload = imageLoaded
      bgImg.onerror = imageLoaded
      bgImg.src = vinyl.attachments[1]?.url || "/placeholder.svg?height=1080&width=1920"
    })

    // If there are no vinyls, set as loaded
    if (vinyls.length === 0) {
      setImagesLoaded(true)
    }
  }, [vinyls])

  // Update current index when slide changes
  const onSelect = useCallback(() => {
    if (!emblaApi) return

    const newIndex = emblaApi.selectedScrollSnap()

    // Only update if the index has changed
    if (newIndex !== currentIndex) {
      setIsTransitioning(true)
      setCurrentIndex(newIndex)

      // Reset transitioning state after animation completes
      setTimeout(() => {
        setIsTransitioning(false)
      }, 1000) // Match this with the transition duration
    }
  }, [emblaApi, currentIndex])

  // Initialize carousel
  useEffect(() => {
    if (!emblaApi) return

    // Add event listeners
    emblaApi.on("select", onSelect)

    // Initial selection
    onSelect()

    // Cleanup
    return () => {
      emblaApi.off("select", onSelect)
    }
  }, [emblaApi, onSelect])

  // Auto-slide functionality
  useEffect(() => {
    if (!emblaApi || vinyls.length <= 1 || isTransitioning) return

    const interval = setInterval(() => {
      if (emblaApi.canScrollNext()) {
        // Get the current index
        const currentIndex = emblaApi.selectedScrollSnap()

        // Calculate the next index with loop handling
        const nextIndex = currentIndex === vinyls.length - 1 ? 0 : currentIndex + 1

        // Set transitioning state
        setIsTransitioning(true)

        // Scroll directly to the next index
        emblaApi.scrollTo(nextIndex)

        // Reset transitioning state after animation completes
        setTimeout(() => {
          setIsTransitioning(false)
        }, 1000) // Match this with the transition duration
      }
    }, 10000) // 10 seconds between slides

    return () => clearInterval(interval)
  }, [emblaApi, vinyls.length, isTransitioning])

  // Fixed navigation functions
  const scrollPrev = useCallback(() => {
    if (!emblaApi || isTransitioning) return

    // Set transitioning state
    setIsTransitioning(true)

    // Get the current index
    const currentIndex = emblaApi.selectedScrollSnap()

    // Calculate the previous index with loop handling
    const prevIndex = currentIndex === 0 ? vinyls.length - 1 : currentIndex - 1

    // Scroll directly to the previous index
    emblaApi.scrollTo(prevIndex)

    // Reset transitioning state after animation completes
    setTimeout(() => {
      setIsTransitioning(false)
    }, 1000) // Match this with the transition duration
  }, [emblaApi, vinyls.length, isTransitioning])

  const scrollNext = useCallback(() => {
    if (!emblaApi || isTransitioning) return

    // Set transitioning state
    setIsTransitioning(true)

    // Get the current index
    const currentIndex = emblaApi.selectedScrollSnap()

    // Calculate the next index with loop handling
    const nextIndex = currentIndex === vinyls.length - 1 ? 0 : currentIndex + 1

    // Scroll directly to the next index
    emblaApi.scrollTo(nextIndex)

    // Reset transitioning state after animation completes
    setTimeout(() => {
      setIsTransitioning(false)
    }, 1000) // Match this with the transition duration
  }, [emblaApi, vinyls.length, isTransitioning])

  // Handle empty state
  if (!vinyls.length) {
    return <div className="flex items-center justify-center h-[400px]">No vinyls found</div>
  }

  // Show loading state until all images are loaded
  if (!imagesLoaded) {
    return (
      <div className="flex items-center justify-center h-[600px] bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-[600px] overflow-hidden bg-black will-change-transform">
      {/* Fixed background with gradient */}
      <div className="absolute inset-0 bg-black z-0"></div>

      {/* Background image with CSS will-change for better performance */}
      <div
        className="absolute inset-0 transition-opacity duration-1000 ease-in-out will-change-opacity"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.3,
          zIndex: 1,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
      </div>

      <div className="relative z-10 container mx-auto h-full flex flex-col justify-center">
        {/* Carousel */}
        <div className="overflow-hidden will-change-transform" ref={emblaRef}>
          <div className="flex transition-transform duration-1000 ease-in-out will-change-transform">
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

        {/* Navigation buttons - disabled during transitions */}
        {/* <div className="absolute left-4 top-1/2 -translate-y-1/2 z-30">
          <button
            type="button"
            onClick={scrollPrev}
            disabled={isTransitioning}
            className={`bg-black/50 hover:bg-black/70 text-white rounded-full p-3 focus:outline-none transition-all duration-200 ${
              isTransitioning ? "opacity-50 cursor-not-allowed" : "hover:scale-110"
            }`}
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        </div>

        <div className="absolute right-4 top-1/2 -translate-y-1/2 z-30">
          <button
            type="button"
            onClick={scrollNext}
            disabled={isTransitioning}
            className={`bg-black/50 hover:bg-black/70 text-white rounded-full p-3 focus:outline-none transition-all duration-200 ${
              isTransitioning ? "opacity-50 cursor-not-allowed" : "hover:scale-110"
            }`}
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div> */}

        {/* Slide indicators - disabled during transitions */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {vinyls.map((_, index) => (
            <button
              key={index}
              disabled={isTransitioning}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex ? "bg-white w-6" : "bg-white/50"
              } ${isTransitioning ? "opacity-50 cursor-not-allowed" : ""}`}
              onClick={() => !isTransitioning && emblaApi?.scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
