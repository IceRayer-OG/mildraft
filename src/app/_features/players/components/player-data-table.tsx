"use client";
import { useState, useMemo } from "react";
import { useAppTable, createAppColumnHelper } from "~/hooks/table";

import { flexRender } from "@tanstack/react-table";

// UI
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/_components/ui/dropdown-menu";
import { Input } from "~/_components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/_components/ui/table";
import { Button } from "~/_components/ui/button";

// Components
import { PlayerLoadingDialog } from "./PlayerLoadingDialog";

// Types
import { type Players } from "../utils/players";

interface PlayerDataTableProps {
  data: Players[];
}

const POSITIONS = [
  { label: "RHP", value: "RHP" },
  { label: "LHP", value: "LHP" },
  { label: "C", value: "C" },
  { label: "1B", value: "1B" },
  { label: "2B", value: "2B" },
  { label: "3B", value: "3B" },
  { label: "SS", value: "SS" },
  { label: "DH", value: "DH" },
  { label: "CI", value: "CI" },
  { label: "MI", value: "MI" },
  { label: "INF", value: "INF" },
  { label: "OF", value: "OF" },
  { label: "UTIL", value: "UTIL" },
];

const TEAMS = [
  { label: "Arizona Diamondbacks", value: "Arizona Diamondbacks" },
  { label: "Athletics", value: "Athletics" },
  { label: "Atlanta Braves", value: "Atlanta Braves" },
  { label: "Baltimore Orioles", value: "Baltimore Orioles" },
  { label: "Boston Red Sox", value: "Boston Red Sox" },
  { label: "Chicago Cubs", value: "Chicago Cubs" },
  { label: "Chicago White Sox", value: "Chicago White Sox" },
  { label: "Cincinnati Reds", value: "Cincinnati Reds" },
  { label: "Cleveland Guardians", value: "Cleveland Guardians" },
  { label: "Colorado Rockies", value: "Colorado Rockies" },
  { label: "Detroit Tigers", value: "Detroit Tigers" },
  { label: "Houston Astros", value: "Houston Astros" },
  { label: "Kansas City Royals", value: "Kansas City Royals" },
  { label: "Los Angeles Angels", value: "Los Angeles Angels" },
  { label: "Los Angeles Dodgers", value: "Los Angeles Dodgers" },
  { label: "Miami Marlins", value: "Miami Marlins" },
  { label: "Milwaukee Brewers", value: "Milwaukee Brewers" },
  { label: "Minnesota Twins", value: "Minnesota Twins" },
  { label: "New York Mets", value: "New York Mets" },
  { label: "New York Yankees", value: "New York Yankees" },
  { label: "Philadelphia Phillies", value: "Philadelphia Phillies" },
  { label: "Pittsburgh Pirates", value: "Pittsburgh Pirates" },
  { label: "San Diego Padres", value: "San Diego Padres" },
  { label: "Seattle Mariners", value: "Seattle Mariners" },
  { label: "San Francisco Giants", value: "San Francisco Giants" },
  { label: "St. Louis Cardinals", value: "St. Louis Cardinals" },
  { label: "Tampa Bay Rays", value: "Tampa Bay Rays" },
  { label: "Texas Rangers", value: "Texas Rangers" },
  { label: "Toronto Blue Jays", value: "Toronto Blue Jays" },
  { label: "Washington Nationals", value: "Washington Nationals" },
];

const columnHelper = createAppColumnHelper<Players>();



export function PlayerDataTable({ data: initialData }: PlayerDataTableProps) {
  const [data, setData] = useState(initialData);

  const playerColumns = useMemo(() =>
  columnHelper.columns([
    columnHelper.accessor("teamRank", {
      id: "teamRank",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Team Rank
            <ArrowUpDown className="" />
          </Button>
        );
      },
      sortFn: "blankToBottom",
    }),
    columnHelper.accessor("playerName", {
      id: "playerName",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Player Name
            <ArrowUpDown className="" />
          </Button>
        );
      },
    }),
    columnHelper.accessor("position", {
      id: "position",
      header: "Position",
      filterFn: (row, id, value: string[]) => {
        // Cast the row value to string[] to resolve the 'includes' error
        const rowValue = row.getValue(id) as string[];

        // Safety check: ensure rowValue exists and is an array
        if (!rowValue || !Array.isArray(rowValue)) return false;

        // Return true if any of the selected filter values (value)
        // are present in the row's array (rowValue)
        return value.some((val) => rowValue.includes(val));
      },
      cell: ({ row }) => {
        const positions = row.getValue("position") as string[];
        return <div className="flex gap-1">{positions.join(", ")}</div>;
      },
    }),
    columnHelper.accessor("team", {
      id: "team",
      header: "Team",
    }),
    columnHelper.accessor("throws", {
      id: "throws",
      header: "Throws",
    }),
    columnHelper.accessor("bats", {
      id: "bats",
      header: "Bats",
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const player = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem /* onClick={() => draftPlayer(player)}> */>
                Add
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    }),
  ]),
  []
);

  const table = useAppTable({
    data,
    columns: playerColumns,
  });

  return (
    <table.AppTable>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-1 items-center space-x-2">
            {/* Replace Input with Faceted Filter for the 'position' column */}
            <table.TableFacetedFilter
              id="position"
              title="Position"
              options={POSITIONS}
            />
            <table.TableFacetedFilter id="team" title="Team" options={TEAMS} />
            <Input
              placeholder="Player Name..."
              value={
                (table.getColumn("playerName")?.getFilterValue() as string) ??
                ""
              }
              onChange={(event) =>
                table
                  .getColumn("playerName")
                  ?.setFilterValue(event.target.value)
              }
              className="max-w-sm"
            />

            {playerColumns.length > 0 && (
              <Button
                variant="destructive"
                onClick={() => table.resetColumnFilters()}
                className="h-8 px-2 text-lg lg:px-3"
              >
                Reset
              </Button>
            )}
          </div>
          <PlayerLoadingDialog />
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader className="bg-white text-stone-950">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
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
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={playerColumns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <table.TablePagination />
        </div>
      </div>
    </table.AppTable>
  );
}
