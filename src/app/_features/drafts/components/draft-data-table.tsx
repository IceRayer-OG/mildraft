"use client";

import { useState, useMemo } from "react";
import { useAppTable, createAppColumnHelper, appFeatures } from "~/hooks/table";
import { useSelector } from "@tanstack/react-store";
import { type Column, type RowData } from "@tanstack/react-table";

import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Search,
  X,
  BookmarkPlus,
} from "lucide-react";
import { Button } from "~/_components/ui/button";
import { Badge } from "~/_components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/_components/ui/tooltip";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/_components/ui/table";
import { toast } from "sonner";
import { Input } from "~/_components/ui/input";
import { cn } from "~/lib/utils";

// Actions
import { draftPlayerAction } from "../actions/draftActions";
import { addPlayerToQueueAction } from "../actions/queueActions";

// Constants & Types
import {
  POSITIONS,
  TEAMS,
  TEAM_ABBREVIATIONS,
} from "../utils/constants";
import { type DraftablePlayers } from "../utils/draft";
import { TableFacetedFilter } from "~/_components/table/TableFacetedFilters";

const columnHelper = createAppColumnHelper<DraftablePlayers>();

async function queuePlayer(playerToQueue: DraftablePlayers) {
  try {
    await addPlayerToQueueAction(playerToQueue);
    toast.success(`${playerToQueue.playerName} has been added to your queue`);
  } catch (error) {
    console.error(error);
    toast.error("Error adding player to queue");
  }
}

async function draftPlayer(playerToDraft: DraftablePlayers) {
  const content = {
    status: "",
    message: "",
  };

  const response = await draftPlayerAction(content, playerToDraft);

  if (response.status === "Success") {
    toast.success(response.message);
  } else if (response.status === "Error") {
    toast.error(response.message);
  }
}

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

export function DraftDataTable({
  data: initialData,
}: {
  data: DraftablePlayers[];
}) {
  const [data] = useState(initialData);

  const draftColumns = useMemo(
    () =>
      columnHelper.columns([
        columnHelper.accessor((row) => row.rank, {
          id: "rank",
          header: ({ column }) => <SortableHeader column={column} title="Rank" />,
          cell: ({ row }) => (
            <span className="font-semibold text-stone-200 pl-1">
              {row.getValue("rank") ?? "-"}
            </span>
          ),
          sortFn: "blankToBottom",
        }),
        columnHelper.accessor((row) => row.teamRank, {
          id: "teamRank",
          header: ({ column }) => (
            <SortableHeader column={column} title="Team Rank" />
          ),
          cell: ({ row }) => (
            <span className="text-stone-300">
              {row.getValue("teamRank") ?? "-"}
            </span>
          ),
          sortFn: "blankToBottom",
        }),
        columnHelper.accessor((row) => row.draftRank, {
          id: "draftRank",
          header: ({ column }) => (
            <SortableHeader column={column} title="Draft Rank" />
          ),
          sortFn: "blankToBottom",
          cell: ({ row }) => (
            <span className="text-stone-300">
              {row.getValue("draftRank") ?? "-"}
            </span>
          ),
        }),
        columnHelper.accessor("playerName", {
          id: "playerName",
          header: ({ column }) => (
            <SortableHeader column={column} title="Player" />
          ),
          cell: ({ row }) => (
            <span className="font-medium text-stone-100 whitespace-nowrap">
              {row.getValue("playerName")}
            </span>
          ),
          sortFn: "text",
        }),
        columnHelper.accessor("position", {
          id: "position",
          header: () => (
            <span className="font-semibold text-xs tracking-wider uppercase text-stone-400">
              Position
            </span>
          ),
          filterFn: (row, id, value: string[]) => {
            const rowValue = row.getValue(id) as string[];
            if (!rowValue || !Array.isArray(rowValue)) return false;
            return value.some((val) => rowValue.includes(val));
          },
          cell: ({ row }) => {
            const positions = (row.getValue("position") as string[]) ?? [];
            return (
              <div className="flex flex-wrap gap-1">
                {positions.map((pos) => {
                  const isPitcher = pos === "RHP" || pos === "LHP";
                  const isCatcher = pos === "C";
                  const isOF = pos === "OF";
                  return (
                    <Badge
                      key={pos}
                      variant="outline"
                      className={cn(
                        "text-[10px] px-1.5 py-0 font-medium rounded border-0",
                        isPitcher
                          ? "bg-blue-500/20 text-blue-300"
                          : isCatcher
                            ? "bg-amber-500/20 text-amber-300"
                            : isOF
                              ? "bg-emerald-500/20 text-emerald-300"
                              : "bg-purple-500/20 text-purple-300",
                      )}
                    >
                      {pos}
                    </Badge>
                  );
                })}
              </div>
            );
          },
        }),
        columnHelper.accessor("team", {
          id: "team",
          header: () => (
            <span className="font-semibold text-xs tracking-wider uppercase text-stone-400">
              Team
            </span>
          ),
          enableSorting: false,
          cell: ({ row }) => {
            const teamName = row.getValue("team") as string;
            const abbrev = TEAM_ABBREVIATIONS[teamName] ?? teamName;
            return (
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-xs px-1.5 py-0.5 rounded bg-white/10 text-stone-200 border border-white/10">
                  {abbrev}
                </span>
                <span
                  className="hidden xl:inline text-xs text-stone-300 truncate max-w-[130px]"
                  title={teamName}
                >
                  {teamName}
                </span>
              </div>
            );
          },
        }),
        columnHelper.accessor("age", {
          id: "age",
          header: ({ column }) => <SortableHeader column={column} title="Age" />,
          cell: ({ row }) => (
            <span className="text-stone-300">{row.getValue("age") ?? "-"}</span>
          ),
          sortFn: "blankToBottom",
        }),
        columnHelper.accessor("height", {
          id: "height",
          header: () => (
            <span className="font-semibold text-xs tracking-wider uppercase text-stone-400">
              Height
            </span>
          ),
          enableSorting: false,
          cell: ({ row }) => (
            <span className="text-stone-300 text-xs">
              {row.getValue("height") ?? "-"}
            </span>
          ),
        }),
        columnHelper.accessor("weight", {
          id: "weight",
          header: () => (
            <span className="font-semibold text-xs tracking-wider uppercase text-stone-400">
              Weight
            </span>
          ),
          enableSorting: false,
          cell: ({ row }) => (
            <span className="text-stone-300 text-xs">
              {row.getValue("weight") ? `${row.getValue("weight")} lbs` : "-"}
            </span>
          ),
        }),
        columnHelper.accessor(
          (row) => `${row.bats ?? "-"}/${row.throws ?? "-"}`,
          {
            id: "batsThrows",
            header: () => (
              <span className="font-semibold text-xs tracking-wider uppercase text-stone-400">
                B/T
              </span>
            ),
            enableSorting: false,
            cell: ({ row }) => (
              <span className="font-mono text-xs text-stone-300">
                {row.original.bats ?? "-"}/{row.original.throws ?? "-"}
              </span>
            ),
          },
        ),
        columnHelper.display({
          id: "actions",
          header: () => (
            <span className="font-semibold text-xs tracking-wider uppercase text-stone-400 text-right block pr-2">
              Actions
            </span>
          ),
          cell: ({ row }) => {
            const player = row.original;

            return (
              <div className="flex items-center justify-end gap-1.5 pr-1">
                <TooltipProvider delayDuration={150}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => queuePlayer(player)}
                        className="h-7 px-2 text-xs border-white/20 bg-white/5 hover:bg-white/15 text-stone-200 hover:text-white cursor-pointer"
                      >
                        <BookmarkPlus className="size-3.5 mr-1 text-sky-400" />
                        Queue
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-slate-900 border border-white/15 text-white">
                      Add {player.playerName} to queue
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="sm"
                        onClick={() => draftPlayer(player)}
                        className="h-7 px-2.5 text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-medium shadow-xs cursor-pointer"
                      >
                        Draft
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-slate-900 border border-white/15 text-white">
                      Draft {player.playerName}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            );
          },
        }),
      ]),
    [],
  );

  const table = useAppTable({
    data,
    columns: draftColumns,
  });

  const columnFilters = useSelector(
    table.store,
    (state) => state.columnFilters ?? [],
  );
  const playerNameFilter =
    (table.getColumn("playerName")?.getFilterValue() as string) ?? "";
  const hasActiveFilters =
    columnFilters.length > 0 || playerNameFilter.trim().length > 0;
  const totalPlayers = initialData.length;
  const filteredPlayers = table.getFilteredRowModel().rows.length;

  return (
    <table.AppTable>
      <div className="space-y-3">
        {/* Toolbar & Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 bg-white/5 backdrop-blur-md rounded-lg border border-white/10">
          <div className="flex flex-wrap flex-1 items-center gap-2">
            <div className="relative flex-1 min-w-[200px] max-w-xs">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-stone-400 pointer-events-none" />
              <Input
                placeholder="Search player name..."
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
                  title="Clear search"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>

            <TableFacetedFilter
              id="position"
              title="Position"
              options={POSITIONS}
            />
            <TableFacetedFilter
              id="team"
              title="Team"
              options={TEAMS}
            />

            {hasActiveFilters && (
              <Button
                variant="ghost"
                onClick={() => {
                  table.resetColumnFilters();
                  table.getColumn("playerName")?.setFilterValue("");
                }}
                className="h-8 px-2.5 text-xs text-rose-300 hover:text-rose-200 hover:bg-rose-950/40 border border-rose-500/30 cursor-pointer"
              >
                <X className="mr-1 size-3.5" />
                Reset Filters
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs text-stone-400 self-end sm:self-auto">
            <span className="px-2.5 py-1 rounded bg-black/40 border border-white/10 font-medium">
              Showing{" "}
              <span className="text-white font-semibold">
                {filteredPlayers}
              </span>{" "}
              of {totalPlayers}
            </span>
          </div>
        </div>

        {/* Table Container */}
        <div className="rounded-lg border border-white/15 overflow-hidden bg-black/40 backdrop-blur-md shadow-xl">
          <div className="overflow-x-auto max-h-[60vh]">
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
                      colSpan={draftColumns.length}
                      className="h-28 text-center text-stone-400"
                    >
                      No players match the current filters.
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
      <div className="h-5"></div>
    </table.AppTable>
  );
}
