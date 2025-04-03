import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getUserDataSelect } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { unstable_cache } from "next/cache";
import Link from "next/link";
import { Suspense } from "react";
import UserAvatar from "./UserAvatar";
import FollowButton from "./FollowButton";
import { Badge } from "@/components/ui/badge"
import { Music } from 'lucide-react'


export default function TrendsSidebar() {
  return (
    <div className="sticky top-[5.25rem]  h-fit w-100 flex-none space-y-5 md:block lg:w-100">
        {/* Suspense is used in server components to let data load without affecting the other data loading like posts
        we could put each in its own suspense but it's better for all to load */}
      <Suspense fallback={<Loader2 className="mx-auto animate-spin" />}>
        <WhoToFollow />
        <GetGenres/>
        <TrendingTopics />  
      </Suspense>
    </div>
  );
}

interface Genre {
  id: string;
  name: string;
  count: number;
}

async function GetGenres() {

  const genres = await getTopGenres();

  return (
    <div className="rounded-lg bg-card p-6 shadow-md">
      <div className="flex justify-between">
        <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
          Top Genres
        </h2>
        <Link className="font-semibold mt-0.5" href="/vinyls/genres">View All</Link>
        </div>
      <div className="flex flex-wrap gap-2">
        {genres.map(({ name, id, count }) => (
          <Badge
            key={id}
            variant="secondary"
            className="flex items-center space-x-1"
          >
            <Music className="h-3 w-3" />
            <Link href={`/vinyls/genres/${name}/${id}`}>
              <span>{name}</span>
              
            </Link>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {count.toLocaleString()}
            </span>
          </Badge>
        ))}
      </div>

    </div>
  );
}

  const getTopGenres = unstable_cache(
    async (): Promise<Genre[]> => {
      try {
        const genres = await prisma.genre.findMany({
          select: {
            id: true,
            name: true,
            _count: {
              select: { vinyls: true }
            }
          },
          orderBy: {
            vinyls: { _count: 'desc' }
          },
          take:8
        })
  
        return genres.map((row) => ({
          id: row.id,
          name: row.name,
          count: row._count.vinyls,
        }));
      } catch (error) {
        console.error('Error fetching top genres:', error);
        throw new Error('Failed to fetch top genres');
      }
    },
    ["top_genres"],
    {
      revalidate: 1 * 60 * 60,
      tags: ['genres'],
    }
  );

async function WhoToFollow() {
  const { user } = await validateRequest();

  if (!user) return null;

  if(!user.verified) return null;

  const usersToFollow = await prisma.user.findMany({
    where: {
      NOT: {
        id: user.id,
      },
      followers: {
        none: {
          followerId: user.id,
        },
      },
    },
    select: getUserDataSelect(user.id),
    take: 5,
  });
  return (
    <div className="space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <div className="text-xl font-bold">Who to follow</div>
      {usersToFollow.map((user) => (
        <div key={user.id} className="flex items-center justify-between gap-3">
          <Link
            href={`/users/${user.username}`}
            className="flex items-center gap-3"
          >
            <UserAvatar avatarUrl={user.avatarUrl} className="flex-none" />
            <div>
              <p className="line-clamp-1 break-all font-semibold hover:underline">
                {user.displayName}
              </p>
              <p className="line-clamp-1 break-all text-muted-foreground">
                @{user.username}
              </p>
            </div>
          </Link>
          <FollowButton
            userId={user.id}
            initialState={{
              followers: user._count.followers,
              isFollowedByUser: user.followers.some(
                ({ followerId }) => followerId === user.id,
              ),
            }}
          />
        </div>
      ))}
    </div>
  );
}

// get data every 3 hours with the revalidate param
// unstable_cache: import from next/cache, cached on the server when we deploy, 
// allows to do heavy DB operations
// allows to cache an operation between multiple requests and multiple users
const getTrendingTopics = unstable_cache(
  async () => {
    const result = await prisma.$queryRaw<{ hashtag: string; count: bigint }[]>`
            SELECT LOWER(unnest(regexp_matches(hashtags, '#[[:alnum:]_]+', 'g'))) AS hashtag, COUNT(*) AS count
            FROM vinyls
            GROUP BY (hashtag)
            ORDER BY count DESC, hashtag ASC
            LIMIT 5
        `;

    return result.map((row) => ({
      hashtag: row.hashtag,
      count: Number(row.count), // cant send bigint between client and server
    }));
  },
  ["trending_topics"], // key for unstable_cache
  {
    revalidate: 3 * 60 * 60, // cached for 3 hours in production
  },
);

async function TrendingTopics() {
  const trendingTopics = await getTrendingTopics();

  return (
    <div className="space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <div className="text-xl font-bold">Trending topics</div>
      {trendingTopics.map(({ hashtag, count }) => {
        const title = hashtag.split("#")[1];

        return (
          <Link key={title} href={`/hashtag/${title}`} className="block">
            <p
              className="line-clamp-1 break-all font-semibold hover:underline"
              title={hashtag}
            >
              {hashtag}
            </p>
            <p className="text-sm text-muted-foreground">
              {formatNumber(count)} {count === 1 ? "vinyl" : "vinyls"}
            </p>
          </Link>
        );
      })}
    </div>
  );
}