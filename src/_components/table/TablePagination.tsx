import { useTableContext } from "~/hooks/table";

import { Button } from "~/_components/ui/button";

export function TablePagination() {
  const table = useTableContext();
  return (
    <div className="Pagination flex items-center justify-end space-x-2 py-4">
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
  );
}
