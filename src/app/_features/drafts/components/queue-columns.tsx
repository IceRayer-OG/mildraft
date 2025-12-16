"use client";
 
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

// Types
import { type QueuePlayers } from "../utils/draft";

// Actions
import { removePlayerFromQueueAction } from "../actions/queueActions";
import { draftPlayerAction } from "../actions/draftActions";

async function removePlayerFromQueue(playerToRemove: QueuePlayers) {
  try {
    await removePlayerFromQueueAction(playerToRemove);
    toast.success('Player Removed from Queue',{
      description: `${playerToRemove.playerName} has been removed from your queue`
    });

  } catch (error) {
    console.log(error);
    toast.error('Error removing player from queue');
  }
}

async function draftPlayer(playerToDraft: QueuePlayers) {
  try {
    await draftPlayerAction(playerToDraft);
    toast.success(`${playerToDraft.playerName} has been drafted`);
  } catch (error) {
    console.log(error);
  }
}

export const queueColumns: ColumnDef<QueuePlayers>[] = [
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
              <DropdownMenuItem onClick={() => removePlayerFromQueue(player)}>
                Remove
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]
