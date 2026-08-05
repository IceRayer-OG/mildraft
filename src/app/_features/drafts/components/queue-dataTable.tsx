"use client";

import {
  flexRender,
  tableFeatures,
  useTable,
  createColumnHelper,
  rowSelectionFeature,
  columnVisibilityFeature,
  type ColumnDef,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/_components/ui/table";

// UI Components
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
import { useState } from "react";

interface QueueDataTableProps {
  data: QueuePlayers[];
}

async function removePlayerFromQueue(playerToRemove: QueuePlayers) {
  try {
    await removePlayerFromQueueAction(playerToRemove);
    toast.success("Player Removed from Queue", {
      description: `${playerToRemove.playerName} has been removed from your queue`,
    });
  } catch (error) {
    console.log(error);
    toast.error("Error removing player from queue");
  }
}

async function draftPlayer(playerToDraft: QueuePlayers) {
  const content = {
    status: "",
    message: "",
  };

  const response = await draftPlayerAction(content, playerToDraft);

  if (response.status === "Success") {
    toast.success(response.message);
  } else if (response.status === "Error") {
    toast.error(response.message);
  }
}

const features = tableFeatures({
  rowSelectionFeature,
  columnVisibilityFeature,
});

const columnHelper = createColumnHelper<typeof features, QueuePlayers>();

const queueColumns = columnHelper.columns([
  columnHelper.accessor("playerName", {
    header: "Player Name",
  }),
  columnHelper.accessor("position", {
    header: "Position",
  }),
  columnHelper.accessor("team", {
    header: "Team",
  }),
  columnHelper.accessor("age", {
    header: "Age",
  }),
  columnHelper.accessor("height", {
    header: "Height",
  }),
  columnHelper.accessor("weight", {
    header: "Weight",
  }),
  columnHelper.accessor("throws", {
    header: "Throws",
  }),
  columnHelper.accessor("bats", {
    header: "Bats",
  }),
  columnHelper.display({
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const player = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-white" align="end">
            <DropdownMenuItem onClick={() => draftPlayer(player)}>
              Draft
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => removePlayerFromQueue(player)}>
              Remove
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  }),
]);

export function QueueDataTable({ data: initialData }: QueueDataTableProps) {

  const [data, setData] = useState(initialData);
  
  const table = useTable({
    features,
    columns: queueColumns,
    data,
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={queueColumns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
