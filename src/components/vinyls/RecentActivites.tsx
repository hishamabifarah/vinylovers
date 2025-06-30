'use client';

import { UserDataVinylActivity } from "@/lib/types";
import Image from "next/image";
import slugify from "slugify";
import Link from "next/link";

interface ActivityProps {
    activity: UserDataVinylActivity;
}

export default function RecentActivitiesList({ activity }: ActivityProps) {

      const vinylArtist = slugify(activity.artist, { lower: true, strict: true });
  const vinylAlbum = slugify(activity.album, { lower: true, strict: true });

    return (
        <div className="py-2 px-1">
            <Link href={`/vinyls/${vinylArtist}/${vinylAlbum}/${activity.id}`}>
            <div key={activity.id} className="flex flex-col p-6 rounded-2xl bg-card">
                <div className="flex items-center mb-2">
                    <Image
                        src={activity.user.avatarUrl || '/default-avatar.png'}
                        alt={activity.user.username}
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-full mr-2"
                            />
                    <span className="font-semibold text-gray-900 dark:text-white">{activity.user.username}</span>
                </div>
                <div className="mb-2 text-sm text-gray-700 dark:text-gray-300 text-left">
                    added the vinyl by <span className="font-bold">{activity.artist}</span> named <span className="font-bold">{activity.album}</span>
                </div>
                {/* <Image
                    src={activity.user.avatarUrl || '/default-avatar.png'}
                    alt={activity.album}
                    width={96}
                    height={96}
                    className="w-24 h-24 object-cover rounded"
                    /> */}
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    {new Date(activity.createdAt).toLocaleString()}
                </div>
            </div>
</Link>
        </div>
    )
}