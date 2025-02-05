import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TrendsSidebar from "@/components/TrendsSidebar";
import ForYouFeed from "./ForYouFeed";
import FollowingFeed from "./FollowingFeed";
import FeaturedVinyls from "./FeaturedVinyls";

export default function Home() {

  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
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