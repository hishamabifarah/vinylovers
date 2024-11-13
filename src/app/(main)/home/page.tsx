
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TrendsSidebar from "@/components/TrendsSidebar";

import Image from "next/image"
import UserAvatar from "@/components/UserAvatar"
import ForYouFeed from "./ForYouFeed";
import FollowingFeed from "./FollowingFeed";
import FeaturedVinyls from "./FeaturedVinyls";

export default function Home() {
  // const [activeTab, setActiveTab] = useState("discover")

  const albums = [
    { id: 1, title: "Rumours", artist: "Fleetwood Mac", image: "/vinyl1.jpg" },
    { id: 2, title: "Dark Side of the Moon", artist: "Pink Floyd", image: "/vinyl2.jpg" },
    { id: 3, title: "Thriller", artist: "Michael Jackson", image: "/vinyl3.jpg" },
    { id: 4, title: "Back in Black", artist: "AC/DC", image: "/vinyl4.jpg" },
    { id: 5, title: "Led Zeppelin IV", artist: "Led Zeppelin", image: "/vinyl1.jpg" },
    { id: 6, title: "Purple Rain", artist: "Prince", image: "/vinyl2.jpg" },
  ]

  const topUsers = [
    { id: 1, name: "VinylQueen", vinylCount: 1200, avatar: "/placeholder.svg?height=40&width=40" },
    { id: 2, name: "RecordKing", vinylCount: 1150, avatar: "/placeholder.svg?height=40&width=40" },
    { id: 3, name: "TurntableMaster", vinylCount: 1100, avatar: "/placeholder.svg?height=40&width=40" },
    { id: 4, name: "GroovyCollector", vinylCount: 1050, avatar: "/placeholder.svg?height=40&width=40" },
    { id: 5, name: "VinylVoyager", vinylCount: 1000, avatar: "/placeholder.svg?height=40&width=40" }
  ]

  // return (
  //   <div className="min-h-screen bg-gray-100 dark:bg-gray-900">

  //     <main className="container mx-auto px-4 py-8">
  //       <TrendsSidebar/>
  //     </main>
  //   </div>
  // )

  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        {/* <PostEditor /> */}
        <Tabs defaultValue="discover">
          <TabsList>
            <TabsTrigger className="Button" value="discover">Discover</TabsTrigger>
            <TabsTrigger value="following">Following</TabsTrigger>
            <TabsTrigger value="for-you">For you</TabsTrigger>
          </TabsList>
          <TabsContent value="discover">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <FeaturedVinyls/>
            <TrendsSidebar />
          </div>
          </TabsContent>
          <TabsContent value="for-you">
            <ForYouFeed />
          </TabsContent>
          <TabsContent value="following">
            <FollowingFeed />
          </TabsContent>
        </Tabs>
      </div>
     
    </main>
  );
}


