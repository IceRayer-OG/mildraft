"use client";
import { useState, use } from "react";

import {
  createColumnHelper,
  flexRender,
  tableFeatures,
  useTable,
  rowSelectionFeature,
  columnVisibilityFeature,
  columnFilteringFeature,
  createFilteredRowModel,
  rowPaginationFeature,
  createPaginatedRowModel,
  type PaginationState,
} from "@tanstack/react-table";

// UI
import { MoreHorizontal } from "lucide-react";
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
import { Button } from "~/_components/ui/button";
import { toast } from "sonner";

// Actions
import { undoDraftPickAction } from "../actions/draftActions";

// Types
import { type CompletedDraftPicks } from "../utils/draft";

interface DraftPickDataTableProps {
  data: CompletedDraftPicks[];
}

async function undoDraftPick(draftPickToUndo: CompletedDraftPicks) {
  try {
    await undoDraftPickAction(draftPickToUndo.pickNumber);
    toast.success(`${draftPickToUndo.playerName} has been reversed`);
  } catch (error) {
    console.log(error);
    toast.error("Error reversing drafted player");
  }
}

const features = tableFeatures({
  columnVisibilityFeature,
  columnFilteringFeature,
  filteredRowModel: createFilteredRowModel(),
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),
  rowSelectionFeature,
});

const columnHelper = createColumnHelper<typeof features, CompletedDraftPicks>();

export const draftPickColumns = columnHelper.columns([
  columnHelper.accessor("pickNumber", {
    header: "Pick",
  }),
  columnHelper.accessor("playerName", {
    header: "Player Name",
  }),
  columnHelper.accessor("position", {
    header: "Position",
  }),
  columnHelper.accessor("teamName", {
    header: "Team",
  }),
  columnHelper.display({
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const pick = row.original;

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
      );
    },
  }),
]);

export function DraftPickTable({ data: initialPickData }: DraftPickDataTableProps) {
  const [data, setData] = useState(initialPickData);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0, // initial page index
    pageSize: 10, // default page size
  });

  const table = useTable({
    features,
    data,
    columns: draftPickColumns,
    onPaginationChange: setPagination,
    state: {
      pagination,
    },
  });

  return (
    <div>
      <div className="rounded-md">
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
                  colSpan={draftPickColumns.length}
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
