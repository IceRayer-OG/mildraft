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
import  { dbQueuePlayer, dbRemovePlayerFromQueue, dbDraftPlayer } from "./draftFunctions";
import { toast } from "sonner";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export type Players = {
  id: number
  playerName: string
  position: "P"| "C"| "1B"| "2B"| "3B"| "SS"| "OF"| "CI" | "MI" | "DH" | null
  team: string
  age: number
  height: string
  weight: number
  throws: "R" | "L" | "B" | null
  bats: "R" | "L" | "B" | null
};

async function queuePlayer(playerToQueue: Players) {
  try {
    await dbQueuePlayer(playerToQueue);
    toast.success(`${playerToQueue.playerName} has been added to your queue`);
  } catch (error) {
    console.log(error);
  }
}

async function removePlayerFromQueue(playerToRemove: Players) {
  try {
    await dbRemovePlayerFromQueue(playerToRemove);
    toast.message('Player Removed from Queue',{
      description: `${playerToRemove.playerName} has been removed from your queue`
    });
  } catch (error) {
    console.log(error);
  }
}

async function draftPlayer(playerToDraft: Players) {
  try {
    await dbDraftPlayer(playerToDraft);
    toast.success(`${playerToDraft.playerName} has been drafted`);
  } catch (error) {
    console.log(error);
  }
}

export const draftColumns: ColumnDef<Players>[] = [
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

export const queueColumns: ColumnDef<Players>[] = [
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