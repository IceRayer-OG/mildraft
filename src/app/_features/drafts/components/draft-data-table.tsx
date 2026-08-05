"use client";
import { useState } from "react";
import {
  flexRender,
  columnVisibilityFeature,
  rowSortingFeature,
  createSortedRowModel,
  sortFn_alphanumeric,
  sortFn_text,
  columnFilteringFeature,
  createFilteredRowModel,
  columnFacetingFeature,
  createFacetedRowModel,
  createFacetedUniqueValues,
  rowPaginationFeature,
  createPaginatedRowModel,
  useTable,
  columnSizingFeature,
  tableFeatures,
  createColumnHelper,
  filterFn_includesString,
} from "@tanstack/react-table";

import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem, 
  DropdownMenuItem
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
import { DataTableFacetedFilter } from "./draft-table-faceted-filter"; // You will need to create this
import { toast } from "sonner";

import { MoreHorizontal, ArrowUpDown } from "lucide-react";

// Actions
import { addPlayerToQueueAction } from "../actions/queueActions";
import { draftPlayerAction } from "../actions/draftActions";

// Types
import { DraftablePlayers } from "../utils/draft";

interface DraftDataTableProps{
  data: DraftablePlayers[]
}

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

const features = tableFeatures({
  columnVisibilityFeature,
  columnFacetingFeature,
  columnFilteringFeature,
  filteredRowModel: createFilteredRowModel(), // if using client-side filtering
  facetedRowModel: createFacetedRowModel(), // if using client-side faceting
  facetedUniqueValues: createFacetedUniqueValues(),
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  filterFns: {
    includesString: filterFn_includesString,
  },
  sortFns: {
    alphanumeric: sortFn_alphanumeric,
    text: sortFn_text,
  },
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),
  columnSizingFeature,

})

const columnHelper = createColumnHelper<typeof features, DraftablePlayers>()

const draftColumns =  columnHelper.columns([
  columnHelper.accessor("rank", {
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Top 100 Rank
          <ArrowUpDown className="" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="w-px p-1 whitespace-nowrap">{row.getValue("rank")}</div>
      );
    },
    sortFn: (rowA, rowB, columnId) => {
      const a = rowA.getValue(columnId);
      const b = rowB.getValue(columnId);

      // Handle blanks (null, undefined, or empty string)
      const isEmpty = (val: any) =>
        val === null || val === undefined || val === "";

      if (isEmpty(a) && !isEmpty(b)) return 1; // Move A to bottom
      if (!isEmpty(a) && isEmpty(b)) return -1; // Move B to bottom
      if (isEmpty(a) && isEmpty(b)) return 0; // They are equal

      // Standard numeric sort for the remaining values
      return Number(a) > Number(b) ? 1 : -1;
    },
  }),
  columnHelper.accessor("teamRank", {
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
    cell: ({ row }) => {
      return (
        <div className="w-px p-1 whitespace-nowrap">
          {row.getValue("teamRank")}
        </div>
      );
    },
    sortFn: (rowA, rowB, columnId) => {
      const a = rowA.getValue(columnId);
      const b = rowB.getValue(columnId);

      // Handle blanks (null, undefined, or empty string)
      const isEmpty = (val: any) =>
        val === null || val === undefined || val === "";

      if (isEmpty(a) && !isEmpty(b)) return 1; // Move A to bottom
      if (!isEmpty(a) && isEmpty(b)) return -1; // Move B to bottom
      if (isEmpty(a) && isEmpty(b)) return 0; // They are equal

      // Standard numeric sort for the remaining values
      return Number(a) > Number(b) ? 1 : -1;
    },
  }),
  columnHelper.accessor("draftRank", {
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Draft Rank
          <ArrowUpDown className="" />
        </Button>
      );
    },
    sortFn: (rowA, rowB, columnId) => {
      const a = rowA.getValue(columnId);
      const b = rowB.getValue(columnId);

      // Handle blanks (null, undefined, or empty string)
      const isEmpty = (val: any) =>
        val === null || val === undefined || val === "";

      if (isEmpty(a) && !isEmpty(b)) return 1; // Move A to bottom
      if (!isEmpty(a) && isEmpty(b)) return -1; // Move B to bottom
      if (isEmpty(a) && isEmpty(b)) return 0; // They are equal

      // Standard numeric sort for the remaining values
      return Number(a) > Number(b) ? 1 : -1;
    },
    cell: ({ row }) => {
      return (
        <div className="w-px p-1 whitespace-nowrap">
          {row.getValue("draftRank")}
        </div>
      );
    },
  }),
  columnHelper.accessor("playerName", {
    header: ({ column }) => {
      return (
        <div className="p-1 whitespace-nowrap">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Player Name
            <ArrowUpDown className="" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="p-1 whitespace-nowrap">
          {row.getValue("playerName")}
        </div>
      );
    },
  }),
  columnHelper.accessor("position", {
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
        <div className="w-px p-1 whitespace-nowrap">{positions.join(", ")}</div>
      );
    },
  }),
  columnHelper.accessor("team", {
    header: "Team",
  }),
  columnHelper.accessor("age", {
    header: "Age",
  }),
  columnHelper.accessor( "height", {
    header: "Height",
  }),
  columnHelper.accessor("weight",{
    header: "Weight",
  }),
  columnHelper.accessor("throws", {
    header: "Throws",
  }),
  columnHelper.accessor("bats", {
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
]);

export function DraftDataTable({ data: initialData }: DraftDataTableProps) {
  
  const [data, setData] = useState(initialData);

  const table = useTable({
    features,
    data,
    columns: draftColumns,
  });

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="flex flex-1 items-center space-x-2">
          {/* Replace Input with Faceted Filter for the 'position' column */}
          {table.getColumn("position") && (
            <DataTableFacetedFilter
              column={table.getColumn("position")}
              title="Position"
              options={[
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
              ]}
            />
          )}
          {table.getColumn("team") && (
            <DataTableFacetedFilter
              column={table.getColumn("team")}
              title="Team"
              options={[
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
              ]}
            />
          )}
          <Input
            placeholder="Player Name..."
            value={
              (table.getColumn("playerName")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("playerName")?.setFilterValue(event.target.value)
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="ml-auto">
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter(
                (column) => column.getCanHide()
              )
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-md border">
        <Table className="w-full table-auto">
          <TableHeader className="bg-white text-stone-900">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} style={{ width: header.getSize() }}>
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
                <TableRow key={row.id}>
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
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Prev
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
      <div className="h-5">
      </div>
    </div>
  );
}
