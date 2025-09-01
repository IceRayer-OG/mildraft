"use client"

// UI Components
import { type ColumnDef } from "@tanstack/react-table"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/_components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react";
import { Button } from "~/_components/ui/button";
import { toast } from "sonner";

// Types
import { type TeamPlayers } from "../utils/team";

// Server Actions
import { dropPlayerFromMyTeamAction } from "~/app/_features/team/actions/teamActions";

async function dropPlayer(player: TeamPlayers) {
  await dropPlayerFromMyTeamAction(player.player.id);
  toast.success(`${player.pros.playerName} has been removed from your team`);
}

export const teamColumns: ColumnDef<TeamPlayers>[] = [
  {
    accessorKey: "pros.playerName",
    header: "Player Name",
  },
  {
    accessorKey: "pros.position",
    header: "Position",
    id: "position",
  },
  { 
    accessorKey: "pros.team", 
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
            <DropdownMenuItem onClick={() => dropPlayer(player)}>
              Drop
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]