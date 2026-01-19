"use client";

// Refactor
// React and Next.js imports
import { useEffect, useState } from "react";
// UI Components
import { type ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
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
    toast.error("Error adding player to queue");
  }
}

async function draftPlayer(playerToDraft: DraftablePlayers) {
  // setup initial content
  const content = {
    status: "",
    message: "",
  };

  // get response from draft action
  const response = await draftPlayerAction(content, playerToDraft);

  // toast response message
  if (response.status === "Success") {
    toast.success(response.message);
  } else if (response.status === "Error") {
    toast.error(response.message);
  }
}

export const draftColumns: ColumnDef<DraftablePlayers>[] = [
  {
    accessorKey: "rank",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Top 100 Rank
          <ArrowUpDown className="" />
        </Button>
      );
    },
    sortingFn: (rowA, rowB, columnId) => {
      const a = rowA.getValue(columnId);
      const b = rowB.getValue(columnId);

      // Handle blanks (null, undefined, or empty string)
      const isEmpty = (val: any) =>
        val === null || val === undefined || val === "";

      if (isEmpty(a) && !isEmpty(b)) return 1; // Move A to bottom
      if (!isEmpty(a) && isEmpty(b)) return -1; // Move B to bottom
      if (isEmpty(a) && isEmpty(b)) return 0; // They are equal

      // Standard numeric sort for the remaining values
      return Number(a) > Number(b) ? 1 : -1;
    },
  },
  {
    accessorKey: "teamRank",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Team Rank
          <ArrowUpDown className="" />
        </Button>
      );
    },
    sortingFn: (rowA, rowB, columnId) => {
      const a = rowA.getValue(columnId);
      const b = rowB.getValue(columnId);

      // Handle blanks (null, undefined, or empty string)
      const isEmpty = (val: any) =>
        val === null || val === undefined || val === "";

      if (isEmpty(a) && !isEmpty(b)) return 1; // Move A to bottom
      if (!isEmpty(a) && isEmpty(b)) return -1; // Move B to bottom
      if (isEmpty(a) && isEmpty(b)) return 0; // They are equal

      // Standard numeric sort for the remaining values
      return Number(a) > Number(b) ? 1 : -1;
    },
  },
  {
    accessorKey: "draftRank",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Draft Rank
          <ArrowUpDown className="" />
        </Button>
      );
    },
    sortingFn: (rowA, rowB, columnId) => {
      const a = rowA.getValue(columnId);
      const b = rowB.getValue(columnId);

      // Handle blanks (null, undefined, or empty string)
      const isEmpty = (val: any) =>
        val === null || val === undefined || val === "";

      if (isEmpty(a) && !isEmpty(b)) return 1; // Move A to bottom
      if (!isEmpty(a) && isEmpty(b)) return -1; // Move B to bottom
      if (isEmpty(a) && isEmpty(b)) return 0; // They are equal

      // Standard numeric sort for the remaining values
      return Number(a) > Number(b) ? 1 : -1;
    },
  },
  {
    accessorKey: "playerName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Player Name
          <ArrowUpDown className="" />
        </Button>
      );
    },
  },
  {
    accessorKey: "position",
    header: "Position",
    filterFn: (row, id, value: string[]) => {
      // Cast the row value to string[] to resolve the 'includes' error
      const rowValue = row.getValue(id) as string[];

      // Safety check: ensure rowValue exists and is an array
      if (!rowValue || !Array.isArray(rowValue)) return false;

      // Return true if any of the selected filter values (value)
      // are present in the row's array (rowValue)
      return value.some((val) => rowValue.includes(val));
    },
    cell: ({ row }) => {
      const positions = row.getValue("position") as string[];
      return <div className="flex gap-1">{positions.join(", ")}</div>;
    },
  },
  {
    accessorKey: "team",
    header: "Team",
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
      const player = row.original;

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
      );
    },
  },
];
