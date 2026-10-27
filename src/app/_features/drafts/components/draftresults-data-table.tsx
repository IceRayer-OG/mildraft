"use client";

import { useState, useMemo, useEffect } from "react";
import { useAppTable, createAppColumnHelper, appFeatures } from "~/hooks/table";
import { useSelector } from "@tanstack/react-store";
import { type Column, type RowData } from "@tanstack/react-table";

// UI Components
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Search,
  X,
  SlidersHorizontal,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "~/_components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/_components/ui/table";
import { Button } from "~/_components/ui/button";
import { Input } from "~/_components/ui/input";

// Types
import { type DraftResults } from "../utils/draft";

interface ResultsDataTableProps {
  data: DraftResults[];
}

const columnHelper = createAppColumnHelper<DraftResults>();

function SortableHeader<TData extends RowData, TValue>({
  column,
  title,
}: {
  column: Column<typeof appFeatures, TData, TValue>;
  title: string;
}) {
  const isSorted = column.getIsSorted();
  return (
    <button
      type="button"
      onClick={column.getToggleSortingHandler()}
      className="flex items-center gap-1 font-semibold text-xs tracking-wider uppercase text-stone-300 hover:text-white transition-colors cursor-pointer"
    >
      <span>{title}</span>
      {isSorted === "asc" ? (
        <ArrowUp className="size-3.5 text-sky-400" />
      ) : isSorted === "desc" ? (
        <ArrowDown className="size-3.5 text-sky-400" />
      ) : (
        <ArrowUpDown className="size-3 text-stone-500 opacity-60 hover:opacity-100" />
      )}
    </button>
  );
}

export function ResultsDataTable({ data: initialData }: ResultsDataTableProps) {
  const [data, setData] = useState(initialData);

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const resultColumns = useMemo(
    () =>
      columnHelper.columns([
        columnHelper.accessor("pickNumber", {
          id: "pickNumber",
          header: ({ column }) => <SortableHeader column={column} title="Pick" />,
          cell: ({ row }) => (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-sky-500/20 text-sky-300 border border-sky-500/30">
              #{row.getValue("pickNumber")}
            </span>
          ),
          sortFn: "blankToBottom",
        }),
        columnHelper.accessor("teamName", {
          id: "teamName",
          header: ({ column }) => <SortableHeader column={column} title="Team" />,
          cell: ({ row }) => (
            <span className="font-medium text-stone-200 text-sm">
              {row.getValue("teamName") ?? "-"}
            </span>
          ),
          sortFn: "text",
        }),
        columnHelper.accessor("playerName", {
          id: "playerName",
          header: ({ column }) => (
            <SortableHeader column={column} title="Player" />
          ),
          cell: ({ row }) => (
            <span className="font-semibold text-stone-100 text-sm">
              {row.getValue("playerName") ?? "-"}
            </span>
          ),
          sortFn: "text",
        }),
      ]),
    [],
  );

  const table = useAppTable({
    data,
    columns: resultColumns,
  });

  const columnFilters = useSelector(
    table.store,
    (state) => state.columnFilters ?? [],
  );
  const teamNameFilter =
    (table.getColumn("teamName")?.getFilterValue() as string) ?? "";
  const playerNameFilter =
    (table.getColumn("playerName")?.getFilterValue() as string) ?? "";
  const hasActiveFilters =
    columnFilters.length > 0 ||
    teamNameFilter.trim().length > 0 ||
    playerNameFilter.trim().length > 0;
  const totalPicks = initialData.length;
  const filteredPicks = table.getFilteredRowModel().rows.length;

  return (
    <table.AppTable>
      <div className="space-y-3">
        {/* Toolbar & Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 bg-white/5 backdrop-blur-md rounded-lg border border-white/10">
          <div className="flex flex-wrap flex-1 items-center gap-2">
            {/* Search Team */}
            <div className="relative flex-1 min-w-[180px] max-w-xs">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-stone-400 pointer-events-none" />
              <Input
                placeholder="Search team..."
                value={teamNameFilter}
                onChange={(event) =>
                  table
                    .getColumn("teamName")
                    ?.setFilterValue(event.target.value)
                }
                className="pl-9 pr-8 h-8 bg-black/40 border-white/15 text-white placeholder:text-stone-400 focus-visible:ring-sky-500 text-sm"
              />
              {teamNameFilter && (
                <button
                  type="button"
                  onClick={() => table.getColumn("teamName")?.setFilterValue("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white cursor-pointer"
                  title="Clear team search"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>

            {/* Search Player */}
            <div className="relative flex-1 min-w-[180px] max-w-xs">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-stone-400 pointer-events-none" />
              <Input
                placeholder="Search player..."
                value={playerNameFilter}
                onChange={(event) =>
                  table
                    .getColumn("playerName")
                    ?.setFilterValue(event.target.value)
                }
                className="pl-9 pr-8 h-8 bg-black/40 border-white/15 text-white placeholder:text-stone-400 focus-visible:ring-sky-500 text-sm"
              />
              {playerNameFilter && (
                <button
                  type="button"
                  onClick={() =>
                    table.getColumn("playerName")?.setFilterValue("")
                  }
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white cursor-pointer"
                  title="Clear player search"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                onClick={() => {
                  table.resetColumnFilters();
                  table.getColumn("teamName")?.setFilterValue("");
                  table.getColumn("playerName")?.setFilterValue("");
                }}
                className="h-8 px-2.5 text-xs text-rose-300 hover:text-rose-200 hover:bg-rose-950/40 border border-rose-500/30 cursor-pointer"
              >
                <X className="mr-1 size-3.5" />
                Reset Filters
              </Button>
            )}
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            <span className="px-2.5 py-1 rounded bg-black/40 border border-white/10 font-medium text-xs text-stone-400">
              Showing{" "}
              <span className="text-white font-semibold">{filteredPicks}</span>{" "}
              of {totalPicks} picks
            </span>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 border-white/15 bg-white/5 hover:bg-white/15 text-stone-300 text-xs cursor-pointer"
                >
                  <SlidersHorizontal className="mr-1.5 size-3.5" />
                  Columns
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-slate-900 border-white/15 text-white"
              >
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize hover:bg-white/10 cursor-pointer"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Table Container */}
        <div className="rounded-lg border border-white/15 overflow-hidden bg-black/40 backdrop-blur-md shadow-xl">
          <div className="overflow-x-auto max-h-[65vh]">
            <Table className="w-full">
              <TableHeader className="sticky top-0 z-10 bg-slate-950/95 backdrop-blur-md border-b border-white/15">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow
                    key={headerGroup.id}
                    className="border-b border-white/10 hover:bg-transparent"
                  >
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        className="h-10 px-3 py-2 text-stone-300"
                      >
                        {header.isPlaceholder ? null : (
                          <table.FlexRender header={header} />
                        )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody className="divide-y divide-white/5">
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      className="hover:bg-white/5 border-white/5 transition-colors"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="px-3 py-2">
                          <table.FlexRender cell={cell} />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={resultColumns.length}
                      className="h-28 text-center text-stone-400"
                    >
                      No draft results match the current filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Pagination */}
        <table.TablePagination />
      </div>
    </table.AppTable>
  );
}
