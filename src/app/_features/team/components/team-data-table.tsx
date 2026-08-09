"use client";
import { useState, useMemo } from "react";

import {
  type ColumnDef,
  type ColumnFiltersState,
  createColumnHelper,
  flexRender,
  rowPaginationFeature,
  createPaginatedRowModel,
  columnVisibilityFeature,
  rowSelectionFeature,
  tableFeatures,
  useTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/_components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/_components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Button } from "~/_components/ui/button";
import { toast } from "sonner";

import { type TeamPlayers } from "../utils/team";

// Server Actions
import { dropPlayerFromMyTeamAction } from "~/app/_features/team/actions/teamActions";

async function dropPlayer(player: TeamPlayers) {
  await dropPlayerFromMyTeamAction(player.player.id);
  toast.success(`${player.pros.playerName} has been removed from your team`);
}

interface TeamDataTableProps {
  data: TeamPlayers[];
}

const features = tableFeatures({
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),
  rowSelectionFeature,
  columnVisibilityFeature,
});

const columnHelper = createColumnHelper<typeof features, TeamPlayers>();

const teamColumns = useMemo(
  () =>
    columnHelper.columns([
      columnHelper.accessor("pros.playerName", {
        header: "Player Name",
      }),
      columnHelper.accessor("pros.position", {
        header: "Position",
        id: "position",
      }),
      columnHelper.accessor("pros.team", {
        header: "Team",
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const player = row.original;

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
          );
        },
      }),
    ]),
  [],
);

export function TeamDataTable({ data: initialData }: TeamDataTableProps) {
  const [data, setSata] = useState(initialData);

  const table = useTable({
    features,
    data,
    columns: teamColumns,
  });

  return (
    <div>
      <div className="rounded-md">
        <div className="flex items-center py-4">
          {/* <Input
            placeholder="Filter Positions..."
            value={(table.getColumn("position")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("position")?.setFilterValue(event.target.value)
            }
          className="max-w-sm"
          /> */}
        </div>
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
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={teamColumns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Prev
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
