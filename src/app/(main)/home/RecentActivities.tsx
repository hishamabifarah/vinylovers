import { Suspense } from "react";
import { unstable_cache } from "next/cache";
import prisma from '@/lib/prisma'
import VinylsLoadingSkeleton from "@/components/vinyls/VinylsLoadingSkeleton";
import RecentActivitiesList from "@/components/vinyls/RecentActivites";

const getRecentActivities = unstable_cache(
    async () => {

    return await prisma.vinyl.findMany({
        take: 5,
        orderBy: {
            createdAt: 'desc'
        },
        select: {
            id: true,
            artist: true,
            thumbnail: true,
            album: true,
            createdAt: true,
            attachments: true,
            user: {
                select: {
                    id: true,
                    username: true,
                    avatarUrl: true,
                }
            },
        }
    });})


export default async function RecentActivities() {

const activities = await getRecentActivities();

return (
    <div className="mt-4 lg:col-span-2">
        <h1 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
            Recent Activities
        </h1>
      <div className=" mx-auto  py-2">
      <div className="">
                {activities.map((activity) => (
                    <Suspense
                        key={activity.id}
                        fallback={<VinylsLoadingSkeleton />}>
                        <RecentActivitiesList activity={activity} />
                    </Suspense>
                ))}
            </div>
        </div>
    </div>
);
}