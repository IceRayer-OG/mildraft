import { useTableContext, useCellContext } from "~/hooks/table";
import { useSortable } from "@dnd-kit/sortable";

// UI
import { GripVerticalIcon } from "lucide-react";
import { Button } from "~/_components/ui/button";

export function DragCell() {
  const table = useTableContext();
  const cell = useCellContext();
  const rowId = cell.row.id;

  const { attributes, listeners } = useSortable({
    id: rowId,
  });

  return (
    <Button {...attributes} {...listeners}>
      <GripVerticalIcon className="h-4 w-4" />
    </Button>
  );
}
