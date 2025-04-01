'use client'

import Image from "next/image"
import Link from "next/link"
import { Menu, X, ChevronDown } from "lucide-react"
import { useState, useEffect } from "react"
import Logo from '@/assets/logo192.png'

import { Button } from "@/components/ui/button"
import Footer from "./Footer"
import { VinylCarousel } from "../vinyls/carousel/VinylsCarousel"
import { useRouter } from 'next/navigation'

 interface VinylWithDetails {
  id: string
  artist: string
  album: string
  userId: string
  genreId: string
  thumbnail: string | null
  hashtags: string | null
  createdAt: Date
  genre: {
    id: string
    name: string
  }
  attachments: {
    type: string
    url: string
  }[]
}

interface ClientHeaderProps {
  vinyls: VinylWithDetails[]
}


export function ClientHeader({ vinyls }: ClientHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  }

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' })
    }
  }

  if (!isMounted) {
    return null
  }

  return (
    <div className="bg-custom-black text-white">
      {/* Navigation Bar */}
      <header className="left-0 right-0 top-0 z-10 border-b border-gray-800 bg-custom-black bg-opacity-50">
        <div className="container mx-auto px-4">
          <nav className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <Image
                src={Logo}
                alt=""
                role="presentation"
                className="mt-2 h-12 w-12 p-2"
              />
              <Link
                href="/"
                className="mt-1 text-2xl font-bold text-primary"
              >
                Vinylovers{" "}
              </Link>
            </div>
            {/* <div className="hidden items-center space-x-4 md:flex">
              <Button
                variant="ghost"
                className="text-gray-300 hover:text-white"
              >
                Discover
              </Button>

              <Button
                variant="ghost"
                className="flex items-center justify-start gap-3"
                title="Bookmarks"
                asChild
              >
                <Link href="/vinyls/genres">
                  Genres
                </Link>
              </Button>
            </div> */}

            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                className="hidden text-white-300  md:inline-flex"
                onClick={() => router.push('/login')}
              >
                Log In
              </Button>
              <Button onClick={() => router.push('/signup')} className="hidden bg-white text-black hover:bg-gray-200 md:inline-flex">
                SIGN UP
              </Button>
              <button
                className="p-2 text-white focus:outline-none md:hidden"
                onClick={toggleMenu}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="inset-0 z-20 bg-custom-black bg-opacity-90 md:hidden">
          <div className="flex h-full flex-col items-center justify-center py-4 px-4">
            {/* <button className="py-4 text-xl text-white" onClick={toggleMenu}>
              Discover
            </button>
            <button className="py-4 text-xl text-white" onClick={toggleMenu}>
              Genres
            </button> */}
              <Button onClick={() => router.push('/login')} className=" bg-white text-black hover:bg-gray-200 md:inline-flex mb-4">
                LOG IN
              </Button>
            <Button onClick={() => router.push('/signup')} className=" bg-white text-black hover:bg-gray-200 md:inline-flex">
                SIGN UP
              </Button>
          </div>
        </div>
      )}

      {/* Hero Section with Video Background */}
      <section className="relative h-screen overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <video
            src="/main.mp4"
            loop
            muted
            autoPlay
            playsInline
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-custom-black bg-opacity-50" />
        </div>

        {/* Content */}
        <div className="container relative flex h-full items-center px-4">
          <div className="flex flex-col items-center gap-8 md:flex-row">
            <div className="md:w-1/2">
              <h1 className="mb-6 text-4xl font-bold md:text-5xl">
              Share Your Music,<br/> Connect with Vinyl Lovers
              </h1>
              <p className="mb-4 text-lg text-gray-300">
              Join a vibrant community where you can showcase your record collection, discover new music, 
              and connect with people who share your passion for vinyl.
              </p>
              <Button className="bg-red-600 text-white hover:bg-red-700" type="button" onClick={() => router.push('/home')}>
              Start Exploring
              </Button>
            </div>
          </div>
        </div>

        {/* White button at the bottom center */}
        <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 transform">
          <button
            onClick={() => scrollToSection("vinyls-section")}
            className="flex items-center space-x-2 rounded-full bg-white px-6 py-3 text-black transition-colors duration-300 hover:bg-gray-200"
          >
            <span>Discover Vinyls</span>
            <ChevronDown className="h-5 w-5" />
          </button>
        </div>
      </section>

      {/* Vinyls Section */}
      <section id="vinyls-section" className="bg-custom-black py-16">
        <div className="container mx-auto px-4">
          <div className=" flex-col items-center gap-8 md:flex-row md:items-start">
            <div className="md:w-full mb-5">
              <h2 className="mb-6 text-3xl font-bold md:text-4xl">
                Discover the Latest Vinyls Added
              </h2>
              <p className="text-lg text-gray-300">
                Explore our curated collection of newly added vinyl records.
                From classic albums to the hottest new releases, find your next
                favorite on wax.
              </p>
            </div>
            <section className="py-12">
              <VinylCarousel vinyls={vinyls} />
            </section>
          </div>
        </div>

        {/* White button at the bottom center */}
        <div className="text-center mt-4">
          <button
            onClick={() => scrollToSection("cta-section")}
            className="mx-auto flex items-center space-x-2 rounded-full bg-white px-6 py-3 text-black transition-colors duration-300 hover:bg-gray-200"
          >
            <span>Learn More</span>
            <ChevronDown className="h-5 w-5" />
          </button>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta-section" className="bg-custom-black py-20 text-white">
        <div className="container mx-auto px-4">
          <div className="">
            <div className=" text-center">
              <h2 className="mb-6 text-3xl font-bold md:text-4xl">
                Join the Vinylovers community
              </h2>
              <p className="mb-6 text-lg text-white">
                Connect with music lovers, discover new artists, and keep track
                of your record collection. <br/>
                With Vinylovers, you can share your favorite records, explore others’ collections, 
                <br/>and connect with like-minded people who share your passion for music.
              </p>
              <Button className="bg-red-600 text-white hover:bg-red-700" type="button" onClick={() => router.push('/signup')}>
              Sign Up Now
              </Button>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}