import { Skeleton } from "@/components/ui/skeleton"

export function SkeletonStoryCard() {
  return (
    <div className="rounded-2xl bg-card border border-border shadow-sm p-6 flex flex-col gap-4">
      {/* Badge skeleton */}
      <Skeleton className="h-6 w-20 rounded-full" />

      {/* Image skeleton */}
      <Skeleton className="aspect-video w-full rounded-xl" />

      {/* Title skeleton */}
      <div className="flex flex-col gap-2">
        <Skeleton className="h-7 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>

      {/* Description skeleton lines */}
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  )
}
