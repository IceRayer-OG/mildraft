import { Skeleton } from "~/_components/ui/skeleton";
import {
  Table,
  TableBody,
  TableHeader,
  TableRow,
} from "~/_components/ui/table"
import { Button } from "~/_components/ui/button";
import { Separator } from "~/_components/ui/separator";

export function TeamsLoadingSkeleton() {
  return (
    <div className="flex items-center space-x-4">
      <Skeleton className="h-12 w-12 rounded-full bg-slate-800" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-62.5 bg-slate-800" />
      </div>
    </div>
  )
}

export function TeamsTableLoading() {
  return (
    <div className="flex flex-col grow size-full">
      <div className="h-12" >
        <Skeleton className="max-w-sm h-8 bg-slate-800" />
      </div>
      <div className="h-12 mb-2">
         <Skeleton className="h-12 mb-1 w-full bg-white" />
         <Separator />
      </div>
      <div className="h-48 mt-2">
         <Skeleton className="h-24 w-full bg-slate-800" />
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button variant="secondary" size="sm" disabled>Prev</Button>
        <Button variant="secondary" size="sm" disabled>Next</Button>
      </div>
    </div>
  )
}