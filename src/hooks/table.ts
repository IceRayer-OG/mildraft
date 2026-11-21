import {
  columnFilteringFeature,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  createTableHook,
  filterFn_inNumberRange,
  columnFacetingFeature,
  createFacetedRowModel,
  createFacetedUniqueValues,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_text,
  tableFeatures,
  columnVisibilityFeature,
} from "@tanstack/react-table";

// Component imports
import { TablePagination } from "~/_components/table/TablePagination";
import { TableFacetedFilter } from "~/_components/table/TableFacetedFilters";
import { DragCell } from "~/_components/table/CellComponents";
import { normalizeDiacritics } from "~/lib/utils";

/**
 * Custom accent-insensitive and case-insensitive string filter.
 * Matches e.g. "Jesus" with "Jesús", "Acuna" with "Acuña".
 */
export const filterFn_accentInsensitive = (
  row: { getValue: (columnId: string) => unknown },
  columnId: string,
  filterValue: unknown,
): boolean => {
  const rowValue = row.getValue(columnId);
  if (rowValue == null || filterValue == null) return false;
  return normalizeDiacritics(String(rowValue)).includes(
    normalizeDiacritics(String(filterValue)),
  );
};

/**
 * Create the custom table hook with all pre-bound components.
 * This exports:
 * - createAppColumnHelper: Create column definitions with TFeatures already bound
 * - useAppTable: Hook for creating tables with TFeatures baked in
 * - useTableContext: Access table instance in tableComponents
 * - useCellContext: Access cell instance in cellComponents
 * - useHeaderContext: Access header instance in headerComponents
 */
export const {
  appFeatures,
  createAppColumnHelper,
  useAppTable,
  useTableContext,
  useCellContext,
  useHeaderContext,
} = createTableHook({
  // Features are set once here and shared across all tables
  features: tableFeatures({
    columnVisibilityFeature,
    columnFilteringFeature,
    columnFacetingFeature,
    facetedRowModel: createFacetedRowModel(),
    facetedUniqueValues: createFacetedUniqueValues(),
    rowPaginationFeature,
    rowSelectionFeature,
    rowSortingFeature,
    sortedRowModel: createSortedRowModel(),
    filteredRowModel: createFilteredRowModel(),
    paginatedRowModel: createPaginatedRowModel(),
    filterFns: {
      includesString: filterFn_accentInsensitive,
      accentInsensitive: filterFn_accentInsensitive,
      inNumberRange: filterFn_inNumberRange,
    },
    sortFns: {
      alphanumeric: sortFn_alphanumeric,
      text: sortFn_text,
      blankToBottom: (rowA, rowB, columnId) => {
        const a = rowA.getValue(columnId);
        const b = rowB.getValue(columnId);

        // Handle blanks (null, undefined, or empty string)
        const isEmpty = (val: unknown) =>
          val === null || val === undefined || val === "";

        if (isEmpty(a) && !isEmpty(b)) return 1; // Move A to bottom
        if (!isEmpty(a) && isEmpty(b)) return -1; // Move B to bottom
        if (isEmpty(a) && isEmpty(b)) return 0; // They are equal

        // Standard numeric sort for the remaining values
        return Number(a) > Number(b) ? 1 : -1;
      },
    },
  }),

  // set any default table options here too
  getRowId: (row) => row.id,

  tableComponents: {
    // Add any custom table components here
    TablePagination,
    TableFacetedFilter,
  },
  cellComponents: {
    // Add any custom cell components here
    DragCell,
  },
  headerComponents: {
    // Add any custom header components here
  },
});
