"use client"
 
import { type ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/_components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react";
import { Button } from "~/_components/ui/button";

// zod schema
import { type Players } from "../utils/players";
 
export const playerColumns: ColumnDef<Players>[] = [
  {
    accessorKey: "teamRank",
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
    sortingFn: (rowA, rowB, columnId) => {
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
  },
  {
    accessorKey: "playerName",
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
  },
  {
    accessorKey: "position",
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
  },
  { 
    accessorKey: "team", 
    header: "Team" 
  },
  {
    accessorKey: "throws",
    header: "Throws",
  },
  {
    accessorKey: "bats",
    header: "Bats",
  },
  {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const player = row.original
     
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
          )
        },
      },
]