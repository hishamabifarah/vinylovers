import { Skeleton } from "@/components/ui/skeleton";

export default function FollowingLoadingSkeleton() {
    return (
        <div className="space-y-5 w-full">
            <FollowingSkeleton />
            <FollowingSkeleton />
            <FollowingSkeleton />
            <FollowingSkeleton />
            <FollowingSkeleton />
        </div>
    );
}

export const FollowingSkeleton = () => {
    return (
        <div className="w-full flex flex-col gap-4">
            <div className="flex items-center justify-between p-4 rounded-lg border bg-card text-card-foreground shadow-sm hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3 flex-1">
                    <Skeleton className="h-10 w-10 sm:h-12 sm:w-12 rounded-full" />
                    <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-24 sm:w-32" />
                        <Skeleton className="h-3 w-20 sm:w-28" />
                    </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-4">
                    <Skeleton className="h-8 w-20" />
                </div>
            </div>
        </div>
    );
}