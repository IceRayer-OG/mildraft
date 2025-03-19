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
import { type teamPlayers } from "~/utils/players";
 
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
 
export const columns: ColumnDef<teamPlayers>[] = [
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
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const player = row.original
     
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="destructive" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem /* onClick={() => dropPlayer(player)}> */>
                  Drop
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )
        },
      },
]