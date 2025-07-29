"use client";
 
import { type ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react";
import { Button } from "~/_components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/_components/ui/dropdown-menu";
import { dbRemovePlayerFromQueue, dbDraftPlayer } from "~/features/drafts/actions/draftActions";
import { toast } from "sonner";
import { type QueuePlayers } from "~/utils/players";

async function removePlayerFromQueue(playerToRemove: QueuePlayers) {
  try {
    await dbRemovePlayerFromQueue(playerToRemove);
    toast.message('Player Removed from Queue',{
      description: `${playerToRemove.pros.playerName} has been removed from your queue`
    });

  } catch (error) {
    console.log(error);
    toast.error('Error removing player from queue');
  }
}

async function draftPlayer(playerToDraft: QueuePlayers) {
  try {
    await dbDraftPlayer(playerToDraft.pros);
    toast.success(`${playerToDraft.pros.playerName} has been drafted`);
  } catch (error) {
    console.log(error);
  }
}

export const queueColumns: ColumnDef<QueuePlayers>[] = [
    {
      accessorKey: "pros.playerName",
      header: "Player Name",
    },
    {
      accessorKey: "pros.position",
      header: "Position",
    },
    { 
      accessorKey: "pros.team", 
      header: "Team" 
    },
    {
      accessorKey: "pros.age",
      header: "Age",
    },
    {
      accessorKey: "pros.height",
      header: "Height",
    },
    {
      accessorKey: "pros.weight",
      header: "Weight",
    },
    {
      accessorKey: "pros.throws",
      header: "Throws",
    },
    {
      accessorKey: "pros.bats",
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
