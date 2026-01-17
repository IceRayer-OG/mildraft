"use client";
import { useState, use } from "react";
import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getFacetedRowModel, // Added
  getFacetedUniqueValues, // Added
  useReactTable,
  getSortedRowModel,
  SortingState,
} from "@tanstack/react-table";

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
import { DataTableFacetedFilter } from "./draft-table-faceted-filter"; // You will need to create this

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: Promise<TData[]>;
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data: use(data),
    columns,
    state: {
      columnFilters,
      sorting,
    },
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    // Added for enum/faceted filtering
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="flex flex-1 items-center space-x-2">
          {/* Replace Input with Faceted Filter for the 'position' column */}
          {table.getColumn("position") && (
            <DataTableFacetedFilter
              column={table.getColumn("position")}
              title="Position"
              options={[
                { label: "RHP", value: "RHP" },
                { label: "LHP", value: "LHP" },
                { label: "C", value: "C" },
                { label: "1B", value: "1B" },
                { label: "2B", value: "2B" },
                { label: "3B", value: "3B" },
                { label: "SS", value: "SS" },
                { label: "DH", value: "DH" },
                { label: "CI", value: "CI" },
                { label: "MI", value: "MI" },
                { label: "INF", value: "INF" },
                { label: "OF", value: "OF" },
              ]}
            />
          )}
          {table.getColumn("team") && (
            <DataTableFacetedFilter
              column={table.getColumn("team")}
              title="Team"
              options={[
                { label: "Athletics", value: "Athletics" },
                { label: "Baltimore Orioles", value: "Baltimore Orioles" },
                { label: "Detroit Tigers", value: "Detroit Tigers" },
                { label: "Milwaukee Brewers", value: "Milwaukee Brewers" },
                { label: "Minnesota Twins", value: "Minnesota Twins" },
                { label: "Pittsburgh Pirates", value: "Pittsburgh Pirates" },
                { label: "Seattle Mariners", value: "Seattle Mariners" },
                { label: "St. Louis Cardinals", value: "St. Louis Cardinals" },
                { label: "Texas Rangers", value: "Texas Rangers" },
              ]}
            />
          )}
          <Input
            placeholder="Player Name..."
            value={
              (table.getColumn("playerName")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("playerName")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />

          {columnFilters.length > 0 && (
            <Button
              variant="destructive"
              onClick={() => table.resetColumnFilters()}
              className="h-8 px-2 text-lg lg:px-3"
            >
              Reset
            </Button>
          )}
        </div>
        <div className="flex items-center py-4"></div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-white text-stone-950">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
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
                  colSpan={columns.length}
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
