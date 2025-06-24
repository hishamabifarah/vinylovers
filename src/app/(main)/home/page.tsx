import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TrendsSidebar from "@/components/TrendsSidebar";
import ForYouFeed from "./ForYouFeed";
import FollowingFeed from "./FollowingFeed";
import FeaturedVinyls from "./FeaturedVinyls";
import { validateRequest } from "@/auth";

export default async function Home() {

  // const pageStart = Date.now();

  // const validateStart = Date.now();
  const { user } = await validateRequest();
  // const validateDuration = Date.now() - validateStart;
  // console.log(`[Home] validateRequest User took ${validateDuration}ms`);

  // const featuredStart = Date.now();
  // Optionally, if FeaturedVinyls fetches data server-side, you can time its render:
  // (If it's a client component, this will not measure its fetch time)
  // await FeaturedVinyls.preload?.(); // Uncomment if your component supports preload

  // const featuredDuration = Date.now() - featuredStart;
  // console.log(`[Home] FeaturedVinyls render/preload took ${featuredDuration}ms`);

  // const trendsStart = Date.now();
  // await TrendsSidebar.preload?.(); // Uncomment if your component supports preload

  // const trendsDuration = Date.now() - trendsStart;
  // console.log(`[Home] TrendsSidebar render/preload took ${trendsDuration}ms`);

  // const pageDuration = Date.now() - pageStart;
  // console.log(`[Home] Total page render took ${pageDuration}ms`);

  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <Tabs defaultValue="discover">
          <TabsList>
            <TabsTrigger className="Button ml-3 mr-4" value="discover">Discover</TabsTrigger>

            {/* Only show Following and For You tabs if user is logged in */}
            {user && (
              <>
                <TabsTrigger className="mr-4" value="following">Following</TabsTrigger>
                <TabsTrigger className="mr-4" value="for-you">For you</TabsTrigger>
              </>
            )}
          </TabsList>

          <TabsContent value="discover">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              <FeaturedVinyls />
              <TrendsSidebar />
            </div>
          </TabsContent>

          {/* Only render these tab contents if user is logged in */}
          {user && (
            <>
              <TabsContent value="for-you">
                <ForYouFeed />
              </TabsContent>
              <TabsContent value="following">
                <FollowingFeed />
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </main>
  );
}