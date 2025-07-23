import { Skeleton } from "~/_components/ui/skeleton";

export function TeamsLoadingSkeleton() {
  return (
    <div className="flex items-center space-x-4">
      <Skeleton className="h-12 w-12 rounded-full bg-slate-800" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px] bg-slate-800" />
      </div>
    </div>
  )
}