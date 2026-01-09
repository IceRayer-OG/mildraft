"use client";
 
// Refactor
// React and Next.js imports
import { useEffect, useState } from "react";
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
import { type DraftablePlayers } from "../utils/draft";

async function queuePlayer(playerToQueue: DraftablePlayers) {
  try {
    // add player to queue action
    await addPlayerToQueueAction(playerToQueue);
    toast.success(`${playerToQueue.playerName} has been added to your queue`);
  } catch (error) {
    console.log(error);
    toast.error('Error adding player to queue');
  }
}

async function draftPlayer(playerToDraft: DraftablePlayers) {  
    const content = {
      status: "",
      message: ""
    }
    
    const response = await draftPlayerAction(content, playerToDraft);

    if (response.status === "Success") {
      toast.success(response.message);
    } else if (response.status === "Error") {
      toast.error(response.message);
    }  

  // try {
  //   await draftPlayerAction(playerToDraft);
  //   toast.success(`${playerToDraft.playerName} has been drafted`);
  // } catch (error) {
  //   console.log(error);
  //   toast.error('Error drafting player');
  // }
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
      )
    },
  },
]