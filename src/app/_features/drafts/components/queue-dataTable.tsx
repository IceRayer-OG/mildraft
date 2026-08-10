"use client";
import { useState, useMemo } from "react";
import { flexRender, FlexRender, Row } from "@tanstack/react-table";
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { DragEndEvent, UniqueIdentifier } from "@dnd-kit/core";
import { CSSProperties } from "react";

// UI Components
import { GripVerticalIcon, MoreHorizontal } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/_components/ui/table";
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
import { createAppColumnHelper, useAppTable, appFeatures } from "~/hooks/table";

// Cell Component
const RowDragHandleCell = ({ rowId }: { rowId: string }) => {
  const { attributes, listeners } = useSortable({
    id: rowId,
  });
  return (
    // Alternatively, you could set these attributes on the rows themselves
    <button {...attributes} {...listeners}>
      <GripVerticalIcon className="h-4 w-4" />
    </button>
  );
};

// Row Component
const DraggableRow = ({
  row,
}: {
  row: Row<typeof appFeatures, QueuePlayers>;
}) => {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.id,
  });

  const style: CSSProperties = {
    transform: CSS.Translate.toString(transform), // translate instead of transform to avoid squishing
    transition: transition,
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 1 : 0,
    position: "relative",
  };
  return (
    // connect row ref to dnd-kit, apply important styles
    <TableRow ref={setNodeRef} style={style}>
      {row.getAllCells().map((cell) => (
        <TableCell key={cell.id}>
          <FlexRender cell={cell} />
        </TableCell>
      ))}
    </TableRow>
  );
};

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

const columnHelper = createAppColumnHelper<QueuePlayers>();

export function QueueDataTable({
  data: initialData,
}: {
  data: QueuePlayers[];
}) {
  const [data, setData] = useState(initialData);
  const dataIds = useMemo<Array<UniqueIdentifier>>(
    () => data.map(({ id }) => id),
    [data],
  )

  const queueColumns = useMemo(
    () =>
      columnHelper.columns([
        columnHelper.display({
          id: "drag",
          header: "",
          cell: ({ row }) => <RowDragHandleCell rowId={row.id} />,
        }),
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
                  <DropdownMenuItem
                    onClick={() => removePlayerFromQueue(player)}
                  >
                    Remove
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            );
          },
        }),
      ]),
    [],
  );

  const table = useAppTable({
    columns: queueColumns,
    data,
    enableRowSelection: true,
  });

  // reorder rows after drag & drop
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setData((data) => {
        const oldIndex = dataIds.indexOf(active.id);
        const newIndex = dataIds.indexOf(over.id);
        return arrayMove(data, oldIndex, newIndex); // this is just a splice util
      });
    }
  }

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {}),
  );

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      sensors={sensors}
    >
      <table.AppTable>
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
              <SortableContext
                items={dataIds}
                strategy={verticalListSortingStrategy}
              >
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    // <TableRow
                    //   key={row.id}
                    //   data-state={row.getIsSelected() && "selected"}
                    // >
                    //   {row.getVisibleCells().map((cell) => (
                    //     <TableCell key={cell.id}>
                    //       {flexRender(
                    //         cell.column.columnDef.cell,
                    //         cell.getContext(),
                    //       )}
                    //     </TableCell>
                    //   ))}
                    // </TableRow>
                    <DraggableRow key={row.id} row={row} />
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={queueColumns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </SortableContext>
            </TableBody>
          </Table>
        </div>
      </table.AppTable>
    </DndContext>
  );
}
