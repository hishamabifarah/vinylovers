import { Skeleton } from "@/components/ui/skeleton";

export default function NotificationsLoadingSkeleton() {
    return (
        <div className="space-y-5">
            <NotificationSkeleton />
            <NotificationSkeleton />
            <NotificationSkeleton />
            <NotificationSkeleton />
            <NotificationSkeleton />
        </div>
    );
}

export function NotificationSkeleton() {
    return (
        <div className="block">
            <article className="flex gap-3 rounded-2xl bg-card p-5 shadow-sm">
                {/* Icon placeholder */}
                <div className="my-1">
                    <Skeleton className="h-5 w-5 rounded-full" />
                </div>

                <div className="space-y-3 flex-1">
                    {/* Avatar placeholder */}
                    <Skeleton className="h-9 w-9 rounded-full" />

                    {/* User and message text */}
                    <div>
                        <div className="flex flex-wrap gap-1.5 items-center">
                            <Skeleton className="h-4 w-28" /> {/* Username */}
                            <Skeleton className="h-4 w-40" /> {/* Message */}
                        </div>
                    </div>

                    {/* Vinyl info placeholder */}
                    <div className="line-clamp-3 space-y-1.5">
                        <Skeleton className="h-3.5 w-full max-w-[250px]" />
                        <Skeleton className="h-3.5 w-3/4 max-w-[200px]" />
                    </div>
                </div>
            </article>
        </div>
    );
}


