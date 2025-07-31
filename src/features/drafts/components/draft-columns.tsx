"use client";
 
import { type DraftablePlayers } from "../utils/draft";

// Refactor
// UI Components
import { type ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react";
import { Button } from "~/_components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/_components/ui/dropdown-menu";
import { toast } from "sonner";

// Actions
import { addPlayerToQueueAction } from "../actions/queueActions";
import { draftPlayerAction } from "../actions/draftActions";

// Types


async function queuePlayer(playerToQueue: DraftablePlayers) {
  try {
    // add player to queue action
    await addPlayerToQueueAction(playerToQueue);
    
    // await dbQueuePlayer(playerToQueue);
    toast.success(`${playerToQueue.playerName} has been added to your queue`);
  } catch (error) {
    console.log(error);
    toast.error('Error adding player to queue');
  }
}

async function draftPlayer(playerToDraft: DraftablePlayers) {
  try {
    // await dbDraftPlayer(playerToDraft);
    toast.success(`${playerToDraft.playerName} has been drafted`);
  } catch (error) {
    console.log(error);
    toast.error('Error drafting player');
  }
}

export const draftColumns: ColumnDef<DraftablePlayers>[] = [
  {
    accessorKey: "rank",
    header: "Rank",
  },
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
            <DropdownMenuItem onClick={() => draftPlayer(player)}>
              Draft
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => queuePlayer(player)}>
              Queue
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]