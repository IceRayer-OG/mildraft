"use client";
import { useState, useMemo } from "react";
import { useAppTable, createAppColumnHelper } from "~/hooks/table";

import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "~/_components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "~/_components/ui/dropdown-menu";
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

//Actions
import { draftPlayerAction } from "../actions/draftActions";
import { addPlayerToQueueAction } from "../actions/queueActions";

// Types
import { type DraftablePlayers } from "../utils/draft";
import { TableFacetedFilter } from "~/_components/table/TableFacetedFilters";

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

const columnHelper = createAppColumnHelper<DraftablePlayers>();

async function queuePlayer(playerToQueue: DraftablePlayers) {
  try {
    // add player to queue action
    await addPlayerToQueueAction(playerToQueue);
    toast.success(`${playerToQueue.playerName} has been added to your queue`);
  } catch (error) {
    console.log(error);
    toast.error("Error adding player to queue");
  }
}

async function draftPlayer(playerToDraft: DraftablePlayers) {
  // setup initial content
  const content = {
    status: "",
    message: "",
  };

  // get response from draft action
  const response = await draftPlayerAction(content, playerToDraft);

  // toast response message
  if (response.status === "Success") {
    toast.success(response.message);
  } else if (response.status === "Error") {
    toast.error(response.message);
  }
}

export function DraftDataTable({
  data: initialData,
}: {
  data: DraftablePlayers[];
}) {
  const [data, setData] = useState(initialData);

  const draftColumns = useMemo(
    () =>
      columnHelper.columns([
        columnHelper.accessor((row) => row.rank, {
          id: "rank",
          header: () => (
            <Button variant="ghost">
              Rank
              <ArrowUpDown className="" />
            </Button>
          ),
          cell: ({ row }) => {
            return (
              <div className="w-px p-1 whitespace-nowrap">
                {row.getValue("rank")}
              </div>
            );
          },
          sortFn: "blankToBottom",
        }),
        columnHelper.accessor((row) => row.teamRank, {
          id: "teamRank",
          header: () => (
            <Button variant="ghost">
              Team Rank
              <ArrowUpDown className="" />
            </Button>
          ),
          cell: ({ row }) => {
            return (
              <div className="w-px p-1 whitespace-nowrap">
                {row.getValue("teamRank")}
              </div>
            );
          },
          sortFn: "blankToBottom",
        }),
        columnHelper.accessor((row) => row.draftRank, {
          id: "draftRank",
          header: () => (
            <Button variant="ghost">
              DraftRank
              <ArrowUpDown className="" />
            </Button>
          ),
          sortFn: "blankToBottom",
          cell: ({ row }) => {
            return (
              <div className="w-px p-1 whitespace-nowrap">
                {row.getValue("draftRank")}
              </div>
            );
          },
        }),
        columnHelper.accessor("playerName", {
          id: "playerName",
          header: () => (
            <Button variant="ghost">
              Player
              <ArrowUpDown className="" />
            </Button>
          ),
          cell: ({ row }) => {
            return (
              <div className="p-1 whitespace-nowrap">
                {row.getValue("playerName")}
              </div>
            );
          },
          sortFn: "text",
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
            return (
              <div className="w-px p-1 whitespace-nowrap">
                {positions.join(", ")}
              </div>
            );
          },
        }),
        columnHelper.accessor("team", {
          id: "team",
          header: "Team",
          enableSorting: false,
        }),
        columnHelper.accessor("age", {
          id: "age",
          header: "Age",
          enableSorting: false,
        }),
        columnHelper.accessor("height", {
          id: "height",
          header: "Height",
          enableSorting: false,
        }),
        columnHelper.accessor("weight", {
          id: "weight",
          header: "Weight",
          enableSorting: false,
        }),
        columnHelper.accessor("throws", {
          id: "throws",
          header: "Throws",
          enableSorting: false,
        }),
        columnHelper.accessor("bats", {
          id: "bats",
          header: "Bats",
          enableSorting: false,
        }),
        columnHelper.display({
          id: "actions",
          header: "Actions",
          cell: ({ row }) => {
            const player = row.original;

            return (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="size-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white">
                  <DropdownMenuItem onClick={() => draftPlayer(player)}>
                    Draft
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => queuePlayer(player)}>
                    Queue
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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

  return (
    <table.AppTable>
      <div className="space-y-4">
        <div className="flex gap-2">
          <div className="flex flex-1 items-center space-x-2">
            <TableFacetedFilter
              id="position"
              title="Position"
              options={POSITIONS}
            />
            <TableFacetedFilter id="team" title="Team" options={TEAMS} />
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

            {draftColumns.length > 0 && (
              <Button
                variant="destructive"
                onClick={() => table.resetColumnFilters()}
                className="h-8 px-2 text-lg lg:px-3"
              >
                Reset
              </Button>
            )}
          </div>
        </div>
        <div className="rounded-md border">
          <Table className="w-full table-auto">
            <TableHeader className="bg-white text-stone-900">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : (
                        <div
                          className={
                            header.column.getCanSort() ? "sortable-header" : ""
                          }
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          <table.FlexRender header={header} />
                        </div>
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        <table.FlexRender cell={cell} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={draftColumns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <table.TablePagination />
      </div>
      <div className="h-5"></div>
    </table.AppTable>
  );
}
