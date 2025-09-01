import { Skeleton } from "~/_components/ui/skeleton";
export function PostsLoading() {
  return (
    <div className="flex flex-col space-y-2">
        <div className="space-y-2">
            <Skeleton className="h-4 w-[250px] bg-slate-800" />
            <Skeleton className="h-4 w-[250px] bg-slate-800" />
            <Skeleton className="h-4 w-[250px] bg-slate-800" />
        </div>
        <div className="space-y-2">
            <Skeleton className="h-4 w-[250px] bg-slate-800" />
            <Skeleton className="h-4 w-[250px] bg-slate-800" />
            <Skeleton className="h-4 w-[250px] bg-slate-800" />
        </div>
        <div className="space-y-2">
            <Skeleton className="h-4 w-[250px] bg-slate-800" />
            <Skeleton className="h-4 w-[250px] bg-slate-800" />
            <Skeleton className="h-4 w-[250px] bg-slate-800" />  
        </div>
    </div>
  )
}