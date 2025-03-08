"use client"
 
import { type ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react";

import { Button } from "~/_components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/_components/ui/dropdown-menu";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Players = {
  id: string
  playerName: string
  position: "C" | "1B" | "2B" | "3V" | "SS" | "RF" | "CF" | "LF" | "P"
  team: string
  age: number
  height: string
  weight: number
  throws: "R" | "L" | "B"
  bats: "R" | "L" | "B"
}
 
export const columns: ColumnDef<Players>[] = [
  {
    accessorKey: "playerName",
    header: "Player Name",
  },
  {
    accessorKey: "position",
    header: "Position",
  },
  { 
    accessorKey: "team", 
    header: "Team" 
  },
  {
    accessorKey: "dlStatus",
    header: "DL Eligble",
  },
  {
    accessorKey: "age",
    header: "Age",
  },
  {
    accessorKey: "height",
    header: "Height",
  },
  {
    accessorKey: "weight",
    header: "Weight",
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
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(player.id)}>
              Draft
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(player.id)}>
              Queue
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]