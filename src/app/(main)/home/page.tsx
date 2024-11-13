'use client'

import { useState } from "react"
import { Bell, Heart, MessageCircle, Music, Search, Share2, Disc } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import Image from "next/image"

export default function Page() {
  const [activeTab, setActiveTab] = useState("discover")

  
  const images = [
    '/vinyl1.jpg',
    '/vinyl2.jpg',
    '/vinyl3.jpg',
    '/vinyl4.jpg',
  ];

  const albums = [
    { id: 1, title: "Rumours", artist: "Fleetwood Mac", image: "/vinyl1.jpg" },
    { id: 2, title: "Dark Side of the Moon", artist: "Pink Floyd", image: "/vinyl2.jpg" },
    { id: 3, title: "Thriller", artist: "Michael Jackson", image: "/vinyl3.jpg" },
    { id: 4, title: "Back in Black", artist: "AC/DC", image: "/vinyl4.jpg" },
    { id: 5, title: "Led Zeppelin IV", artist: "Led Zeppelin", image: "/vinyl2.jpg" },
    { id: 6, title: "Purple Rain", artist: "Prince", image: "/vinyl3.jpg" },
  ]

  const topGenres = [
    { name: "Rock", count: 1250 },
    { name: "Jazz", count: 980 },
    { name: "Hip Hop", count: 875 },
    { name: "Electronic", count: 720 },
    { name: "Classical", count: 650 },
    { name: "R&B", count: 590 }
  ]
  const topHashtags = [
    { name: "#VinylCollection", count: 3200 },
    { name: "#NowSpinning", count: 2800 },
    { name: "#RareFinds", count: 1950 },
    { name: "#VinylCommunity", count: 1700 },
    { name: "#RecordStore", count: 1500 }
  ]

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* <header className="bg-white dark:bg-gray-800 shadow-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Disc className="h-8 w-8 text-purple-600" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">VinylSocial</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Input
              type="search"
              placeholder="Search albums, artists, users..."
              className="w-64"
            />
            <Button size="icon" variant="ghost">
              <Bell className="h-5 w-5" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost">
                  <Avatar>
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header> */}

      <main className="container mx-auto px-4 py-8">
        <div className="flex space-x-4 mb-8">
          <Button
            variant={activeTab === "discover" ? "default" : "outline"}
            onClick={() => setActiveTab("discover")}
          >
            Discover
          </Button>
          <Button
            variant={activeTab === "following" ? "default" : "outline"}
            onClick={() => setActiveTab("following")}
          >
            Following
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Featured Vinyl</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {albums.map((album) => (
                <div key={album.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                  <div className="flex sm:flex-col">

                    <Image width="100" height="100" src={album.image} alt={album.title} className="w-1/3 sm:w-full h-24 sm:h-48 object-cover" />

                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{album.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{album.artist}</p>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <Button size="sm" variant="ghost">
                          <Heart className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <MessageCircle className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>


          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Top Genres</h2>
              <div className="flex flex-wrap gap-2">
                {topGenres.map((genre) => (
                  <Badge key={genre.name} variant="secondary" className="flex items-center space-x-1">
                    <Music className="h-3 w-3" />
                    <span>{genre.name}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">({genre.count})</span>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Trending Hashtags</h2>
              <ScrollArea className="h-48">
                <div className="space-y-2">
                  {topHashtags.map((hashtag) => (
                    <div key={hashtag.name} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Badge variant="outline" className="mr-2">
                          #
                        </Badge>
                        <span className="text-sm text-gray-600 dark:text-gray-400">{hashtag.name.slice(1)}</span>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{hashtag.count}</span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

