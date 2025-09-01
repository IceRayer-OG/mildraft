"use client"
 
import { type ColumnDef } from "@tanstack/react-table"
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