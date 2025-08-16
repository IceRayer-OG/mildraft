import { Skeleton } from "~/_components/ui/skeleton";
import {
  Table,
  TableBody,
  TableHeader,
  TableRow,
} from "~/_components/ui/table"
import { Button } from "~/_components/ui/button";

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

export function TeamsTableLoading() {
  return (
    <div>
      <Skeleton className="max-w-sm h-8" />
      <Table>
        <TableHeader>
          <TableRow>
            <Skeleton className="h-8 w-full bg-slate-800" />
          </TableRow>
        </TableHeader>
        <TableBody>
            <TableRow>
              <Skeleton className="h-1/6 w-full bg-slate-800" />
            </TableRow>
        </TableBody>
      </Table>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button variant="secondary" size="sm" disabled>Prev</Button>
        <Button variant="secondary" size="sm" disabled>Next</Button>
      </div>
    </div>
  )
}