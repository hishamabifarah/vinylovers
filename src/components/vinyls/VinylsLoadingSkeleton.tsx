import { Skeleton } from "../ui/skeleton";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

export default function VinylsLoadingSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
      <VinylLoadingSkeleton />
      <VinylLoadingSkeleton />
      <VinylLoadingSkeleton />
      <VinylLoadingSkeleton />
    </div>
  );
}

function VinylLoadingSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-square">
        <Skeleton className="h-full w-full" />
      </div>
      <CardContent className="p-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-4 w-16" />
        </div>
      </CardContent>
      <CardFooter className="p-2 flex justify-between">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </CardFooter>
    </Card>
  );
}