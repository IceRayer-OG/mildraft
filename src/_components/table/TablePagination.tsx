"use client";

import { useTableContext } from "~/hooks/table";
import { useSelector } from "@tanstack/react-store";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Button } from "~/_components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/_components/ui/select";

export function TablePagination() {
  const table = useTableContext();
  const pagination = useSelector(
    table.store,
    (state) => state.pagination,
  );

  const currentPage = (pagination?.pageIndex ?? 0) + 1;
  const pageCount = Math.max(table.getPageCount(), 1);
  const pageSize = pagination?.pageSize ?? 10;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-2 py-3 text-xs text-stone-300">
      <div className="flex items-center gap-2">
        <span className="text-stone-400">Rows per page:</span>
        <Select
          value={`${pageSize}`}
          onValueChange={(val) => {
            table.setPageSize(Number(val));
          }}
        >
          <SelectTrigger className="h-8 w-[70px] bg-black/40 border-white/15 text-white">
            <SelectValue placeholder={`${pageSize}`} />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-white/15 text-white">
            {[10, 20, 30, 50, 100].map((size) => (
              <SelectItem
                key={size}
                value={`${size}`}
                className="hover:bg-white/10 cursor-pointer"
              >
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-4">
        <span className="font-medium text-stone-300">
          Page <span className="text-white font-semibold">{currentPage}</span> of{" "}
          <span className="text-white font-semibold">{pageCount}</span>
        </span>

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="size-8 border-white/15 bg-white/5 hover:bg-white/15 text-stone-300 disabled:opacity-30 cursor-pointer"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            title="First page"
          >
            <ChevronsLeft className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8 border-white/15 bg-white/5 hover:bg-white/15 text-stone-300 disabled:opacity-30 cursor-pointer"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            title="Previous page"
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8 border-white/15 bg-white/5 hover:bg-white/15 text-stone-300 disabled:opacity-30 cursor-pointer"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            title="Next page"
          >
            <ChevronRight className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8 border-white/15 bg-white/5 hover:bg-white/15 text-stone-300 disabled:opacity-30 cursor-pointer"
            onClick={() => table.setPageIndex(pageCount - 1)}
            disabled={!table.getCanNextPage()}
            title="Last page"
          >
            <ChevronsRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
