import {
  Heart,
  MessageCircle,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function FeaturedVinyls() {
  const albums = [
    { id: 1, title: "Rumours", artist: "Fleetwood Mac", image: "/vinyl1.jpg" },
    {
      id: 2,
      title: "Dark Side of the Moon",
      artist: "Pink Floyd",
      image: "/vinyl2.jpg",
    },
    {
      id: 3,
      title: "Thriller",
      artist: "Michael Jackson",
      image: "/vinyl3.jpg",
    },
    { id: 4, title: "Back in Black", artist: "AC/DC", image: "/vinyl4.jpg" },
    {
      id: 5,
      title: "Led Zeppelin IV",
      artist: "Led Zeppelin",
      image: "/vinyl1.jpg",
    },
    { id: 6, title: "Purple Rain", artist: "Prince", image: "/vinyl2.jpg" },
  ];
  return (
   
      <div className="lg:col-span-2 mt-4 ">
        <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
          Featured Vinyl
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {albums.map((album) => (
            <div
              key={album.id}
              className="overflow-hidden rounded-lg  shadow-md bg-card "
            >
              <div className="flex sm:flex-col">
                <Image
                  width={100}
                  height={100}
                  src={album.image}
                  alt={album.title}
                  className="h-24 w-1/3 object-cover sm:h-48 sm:w-full m-auto"
                />
                <div className="flex flex-1 flex-col justify-between p-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {album.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {album.artist}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
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
    
  );
}
