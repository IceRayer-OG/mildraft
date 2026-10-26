"use client";
import { useState, useMemo } from "react";

import {
  createColumnHelper,
  flexRender,
  tableFeatures,
  useTable,
  rowSelectionFeature,
  columnVisibilityFeature,
  columnFilteringFeature,
  createFilteredRowModel,
  rowPaginationFeature,
  createPaginatedRowModel,
  type PaginationState,
} from "@tanstack/react-table";

// UI
import { MoreHorizontal, Search, RotateCcw, ChevronLeft, ChevronRight, History } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/_components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/_components/ui/dropdown-menu";
import { Button } from "~/_components/ui/button";
import { Input } from "~/_components/ui/input";
import { Badge } from "~/_components/ui/badge";
import { toast } from "sonner";

// Actions
import { undoDraftPickAction } from "../actions/draftActions";

// Types
import { type CompletedDraftPicks } from "../utils/draft";

interface DraftPickDataTableProps {
  data: CompletedDraftPicks[];
  draftId?: number;
}

const features = tableFeatures({
  columnVisibilityFeature,
  columnFilteringFeature,
  filteredRowModel: createFilteredRowModel(),
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),
  rowSelectionFeature,
});

const columnHelper = createColumnHelper<typeof features, CompletedDraftPicks>();

export function DraftPickTable({ data: initialPickData, draftId }: DraftPickDataTableProps) {
  const [data] = useState(initialPickData);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 8,
  });

  const undoDraftPick = async (draftPickToUndo: CompletedDraftPicks) => {
    try {
      await undoDraftPickAction(draftPickToUndo.pickNumber, draftId);
      toast.success(`Pick #${draftPickToUndo.pickNumber} (${draftPickToUndo.playerName}) reversed`);
    } catch (error) {
      console.error(error);
      toast.error("Error reversing drafted player");
    }
  };

  const filteredData = useMemo(() => {
    if (!globalFilter.trim()) return data;
    const search = globalFilter.toLowerCase();
    return data.filter(
      (item) =>
        item.playerName.toLowerCase().includes(search) ||
        item.teamName.toLowerCase().includes(search) ||
        String(item.pickNumber).includes(search),
    );
  }, [data, globalFilter]);

  const columns = useMemo(
    () =>
      columnHelper.columns([
        columnHelper.accessor("pickNumber", {
          header: "Pick",
          cell: ({ row }) => (
            <Badge
              variant="outline"
              className="font-mono text-xs font-bold text-sky-300 border-sky-500/30 bg-sky-500/10 px-2 py-0.5"
            >
              #{row.original.pickNumber}
            </Badge>
          ),
        }),
        columnHelper.accessor("playerName", {
          header: "Player Name",
          cell: ({ row }) => (
            <span className="font-semibold text-white">{row.original.playerName}</span>
          ),
        }),
        columnHelper.accessor("position", {
          header: "Position",
          cell: ({ row }) => {
            const positions = row.original.position;
            return (
              <div className="flex flex-wrap gap-1">
                {positions && positions.length > 0 ? (
                  positions.map((pos) => (
                    <Badge
                      key={pos}
                      variant="outline"
                      className="border-white/15 bg-white/5 text-stone-300 text-[11px] font-medium px-1.5 py-0"
                    >
                      {pos}
                    </Badge>
                  ))
                ) : (
                  <span className="text-stone-500 text-xs">—</span>
                )}
              </div>
            );
          },
        }),
        columnHelper.accessor("teamName", {
          header: "Team",
          cell: ({ row }) => (
            <span className="text-stone-300 text-xs font-medium">{row.original.teamName}</span>
          ),
        }),
        columnHelper.display({
          id: "actions",
          header: "Actions",
          cell: ({ row }) => {
            const pick = row.original;

            return (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 text-stone-400 hover:text-white hover:bg-white/10 cursor-pointer"
                  >
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="bg-slate-900 border border-white/15 text-white shadow-xl min-w-[130px]"
                  align="end"
                >
                  <DropdownMenuItem
                    onClick={() => undoDraftPick(pick)}
                    className="cursor-pointer text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 focus:bg-rose-500/10 focus:text-rose-300 flex items-center gap-2 font-medium"
                  >
                    <RotateCcw className="size-3.5" />
                    <span>Undo Pick</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            );
          },
        }),
      ]),
    [undoDraftPick],
  );

  const table = useTable({
    features,
    data: filteredData,
    columns,
    onPaginationChange: setPagination,
    state: {
      pagination,
    },
  });

  const totalPicks = filteredData.length;
  const pageCount = table.getPageCount();

  return (
    <div className="flex flex-col gap-3">
      {/* Search Bar */}
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-stone-400" />
        <Input
          placeholder="Search by player or team..."
          value={globalFilter}
          onChange={(e) => {
            setGlobalFilter(e.target.value);
            table.setPageIndex(0);
          }}
          className="pl-9 h-9 bg-white/5 border-white/15 text-white placeholder:text-stone-400 text-xs rounded-lg focus-visible:ring-sky-500"
        />
      </div>

      {/* Table Container */}
      <div className="rounded-xl border border-white/10 bg-slate-950/70 overflow-hidden shadow-lg backdrop-blur-md">
        <Table>
          <TableHeader className="bg-slate-900/90 border-b border-white/15">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-b border-white/15 hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-stone-300 font-semibold text-xs py-2.5">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="border-b border-white/10 hover:bg-white/5 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-2.5">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="hover:bg-transparent border-none">
                <TableCell
                  colSpan={columns.length}
                  className="h-36 text-center"
                >
                  <div className="flex flex-col items-center justify-center gap-1.5 text-stone-400">
                    <div className="rounded-full bg-white/5 p-2.5 border border-white/10 mb-1">
                      <History className="size-5 text-stone-400" />
                    </div>
                    <p className="font-semibold text-xs text-stone-200">
                      {globalFilter ? "No matching picks found" : "No draft picks completed yet"}
                    </p>
                    <p className="text-[11px] text-stone-500">
                      {globalFilter
                        ? "Try clearing your search query."
                        : "Picks will populate here as selections are made."}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Footer */}
      {totalPicks > 0 && (
        <div className="flex items-center justify-between text-xs text-stone-400 pt-1">
          <div>
            <span>Total: </span>
            <strong className="text-stone-200">{totalPicks}</strong>
            <span> {totalPicks === 1 ? "pick" : "picks"}</span>
          </div>

          <div className="flex items-center gap-2">
            <span>
              Page {pagination.pageIndex + 1} of {Math.max(1, pageCount)}
            </span>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="h-7 w-7 p-0 border-white/15 bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white cursor-pointer disabled:opacity-30"
              >
                <ChevronLeft className="size-3.5" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="h-7 w-7 p-0 border-white/15 bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white cursor-pointer disabled:opacity-30"
              >
                <ChevronRight className="size-3.5" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
