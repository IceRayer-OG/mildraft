"use client";
import { useState, use, useMemo } from "react";
import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  columnVisibilityFeature,
  columnFilteringFeature,
  columnSizingFeature,
  rowSelectionFeature,
  rowPaginationFeature,
  createPaginatedRowModel,
  rowSortingFeature,
  createSortedRowModel,
  SortingState,
  useTable,
  tableFeatures,
  createColumnHelper,
  createFilteredRowModel,
  filterFn_includesString,
} from "@tanstack/react-table";

import { createAppColumnHelper, useAppTable } from '~/hooks/table'

// UI
import { ArrowUpDown } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem 
} from "~/_components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/_components/ui/table";
import { Button } from "~/_components/ui/button";
import { Input } from "~/_components/ui/input";

// Types
import { type DraftResults } from "../utils/draft";

interface ResultsDataTableProps{
  data: DraftResults[];
}

const features = tableFeatures({
  columnVisibilityFeature,
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  columnFilteringFeature,
  filteredRowModel: createFilteredRowModel(),
  filterFns: {
    includesString: filterFn_includesString,
  },
  columnSizingFeature,
});


const columnHelper = createColumnHelper<typeof features,DraftResults>();

const resultColumns = columnHelper.columns([
  columnHelper.accessor("pickNumber", {
    header: ({column}) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Pick
          <ArrowUpDown className="" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="w-px p-1 whitespace-nowrap">{row.getValue("pickNumber")}</div>
      );
    },
    sortFn: (rowA, rowB, columnId) => {
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
  }),
  columnHelper.accessor("teamName", {
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Team
          <ArrowUpDown className="" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="w-px p-1 whitespace-nowrap">
          {row.getValue("teamName")}
        </div>
      );
    },
    sortFn: (rowA, rowB, columnId) => {
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
  }),
  columnHelper.accessor("playerName", {
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Player
          <ArrowUpDown className="" />
        </Button>
      );
    },
    sortFn: (rowA, rowB, columnId) => {
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
    cell: ({ row }) => {
      return (
        <div className="w-px p-1 whitespace-nowrap">
          {row.getValue("playerName")}
        </div>
      );
    },
  }),
]);

export function ResultsDataTable({data: initialData}: ResultsDataTableProps) {
  const [data, setData] = useState(initialData);

  const table = useTable({
    features,
    data,
    columns: resultColumns,
  });

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="flex flex-1 items-center space-x-2">
          <Input
            placeholder="Team Name..."
            value={
              (table.getColumn("teamName")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("teamName")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />

          {resultColumns.length > 0 && (
            <Button
              variant="destructive"
              onClick={() => table.resetColumnFilters()}
              className="h-8 px-2 text-lg lg:px-3"
            >
              Reset
            </Button>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="ml-auto">
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter(
                (column) => column.getCanHide()
              )
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-md border">
        <Table className="w-full table-auto">
          <TableHeader className="bg-white text-stone-900">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} style={{ width: header.getSize() }}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
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
                  colSpan={resultColumns.length}
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
      <div className="h-5">
      </div>
    </div>
  );
}
