"use client"
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
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/_components/ui/table"
import { Button } from "~/_components/ui/button";
import { DataTableFacetedFilter } from "./draft-table-faceted-filter"; // You will need to create this

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: Promise<TData[]>
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const table = useReactTable({
    data: use(data),
    columns,
    state: {
      columnFilters,
    },
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    // Added for enum/faceted filtering
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center space-x-2">
          {/* Replace Input with Faceted Filter for the 'position' column */}
          {table.getColumn("position") && (
            <DataTableFacetedFilter
              column={table.getColumn("position")}
              title="Position Filter"
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
          
          {columnFilters.length > 0 && (
            <Button
              variant="destructive"
              onClick={() => table.resetColumnFilters()}
              className="h-8 px-2 lg:px-3 text-lg"
            >
              Reset
            </Button>
          )}
        </div>
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
                      : flexRender(header.column.columnDef.header, header.getContext())}
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
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
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
  )
}