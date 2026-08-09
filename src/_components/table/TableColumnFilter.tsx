import { useTableContext, useHeaderContext } from "~/hooks/table";
import { shallow, useSelector } from "@tanstack/react-store";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";

export function ColumnFilter() {
  const header = useHeaderContext();
  const table = useTableContext();
  const columnId = header.column.id;

  const columnFilterValue = useSelector(
    table.store,
    (state) =>
      state.columnFilters.find((f) => f.id === columnId)?.value as
        | string
        | undefined,
    { compare: shallow },
  );

  if (!header.column.getCanFilter()) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="ml-auto">
          Columns
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {table
          .getAllColumns()
          .filter((column) => column.getCanHide())
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {column.id}
              </DropdownMenuCheckboxItem>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
