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

// Actions
import { undoDraftPickAction } from "../actions/draftActions";

// Types
import { type CompletedDraftPicks } from "../utils/draft";

async function undoDraftPick(draftPickToUndo: CompletedDraftPicks) {
  try {
    await undoDraftPickAction(draftPickToUndo.pickNumber);
    toast.success(`${draftPickToUndo.playerName} has been reversed`);
  } catch (error) {
    console.log(error);
    toast.error('Error reversing drafted player');
  }
}

export const draftPickColumns: ColumnDef<CompletedDraftPicks>[] = [
  {
    accessorKey: "pickNumber",
    header: "Pick",
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
    accessorKey: "teamName", 
    header: "Team" 
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const pick = row.original
 
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-red-400" align="end">
            <DropdownMenuItem onClick={() => undoDraftPick(pick)}>
              Undo
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]