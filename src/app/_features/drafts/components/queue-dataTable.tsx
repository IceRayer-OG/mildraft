"use client";
import { useState, useMemo, useEffect } from "react";
import { flexRender, Row } from "@tanstack/react-table";
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
import {
  GripVerticalIcon,
  MoreHorizontal,
  Zap,
  ListOrdered,
  ChevronUp,
  ChevronDown,
  ArrowUpToLine,
} from "lucide-react";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/_components/ui/alert-dialog";
import { toast } from "sonner";

// Realtime
import { useDraftRealtime } from "../hooks/useDraftRealtime";

// Types
import { type QueuePlayers } from "../utils/draft";

// Actions
import {
  removePlayerFromQueueAction,
  updateMyQueueOrderAction,
} from "../actions/queueActions";
import { draftPlayerAction } from "../actions/draftActions";
import { createAppColumnHelper, useAppTable, appFeatures } from "~/hooks/table";
import { cn } from "~/lib/utils";

const SECONDARY_QUEUE_COLUMNS = new Set([
  "age",
  "height",
  "weight",
  "throws",
  "bats",
]);

// Cell Component
const RowDragHandleCell = ({ rowId }: { rowId: string }) => {
  const { attributes, listeners } = useSortable({
    id: rowId,
  });
  return (
    <button
      {...attributes}
      {...listeners}
      type="button"
      className="p-1.5 touch-none rounded text-stone-400 hover:text-white hover:bg-white/10 active:scale-95 transition-all cursor-grab active:cursor-grabbing"
      aria-label="Drag to reorder player"
    >
      <GripVerticalIcon className="size-4" />
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
    transform: CSS.Transform.toString(transform),
    transition: transition,
    opacity: isDragging ? 0.7 : 1,
    zIndex: isDragging ? 50 : 0,
    position: "relative",
  };

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      className={cn(
        "border-b border-white/5 transition-colors",
        isDragging
          ? "bg-slate-900/90 shadow-2xl ring-1 ring-sky-500/50"
          : "hover:bg-white/5",
      )}
    >
      {row.getVisibleCells().map((cell) => {
        const isSecondary = SECONDARY_QUEUE_COLUMNS.has(cell.column.id);
        return (
          <TableCell
            key={cell.id}
            className={cn(
              "py-2.5 px-3 text-xs",
              isSecondary && "hidden md:table-cell",
            )}
          >
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        );
      })}
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

async function updateMyQueueOrder(
  queueOrder: { playerId: number; rank: number }[],
) {
  try {
    await updateMyQueueOrderAction(queueOrder);
    toast.success("Queue order updated");
  } catch (error) {
    console.log(error);
    toast.error("Error updating queue order");
  }
}

const columnHelper = createAppColumnHelper<QueuePlayers>();

export function QueueDataTable({
  data: initialData,
  draftId = 2,
}: {
  data: QueuePlayers[];
  draftId?: number;
}) {
  const [data, setData] = useState(initialData);
  const [confirmDraftPlayer, setConfirmDraftPlayer] = useState<QueuePlayers | null>(null);

  // Sync state with server revalidations
  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  // Live Pusher synchronization: remove drafted players in real time
  useDraftRealtime({
    draftId,
    onPickMade: (payload) => {
      if (payload.playerId) {
        setData((prev) => prev.filter((p) => p.id !== payload.playerId));
      }
    },
  });

  const dataIds = useMemo<Array<UniqueIdentifier>>(
    () => data.map(({ id }) => id),
    [data],
  );

  const movePlayer = (index: number, direction: -1 | 1) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= data.length) return;

    const newData = arrayMove(data, index, newIndex);
    setData(newData);

    const queueOrder = newData.map((player, idx) => ({
      playerId: player.id,
      rank: idx + 1,
    }));
    updateMyQueueOrder(queueOrder);
  };

  const moveToTop = (index: number) => {
    if (index === 0) return;
    const newData = arrayMove(data, index, 0);
    setData(newData);

    const queueOrder = newData.map((player, idx) => ({
      playerId: player.id,
      rank: idx + 1,
    }));
    updateMyQueueOrder(queueOrder);
  };

  const queueColumns = useMemo(
    () =>
      columnHelper.columns([
        columnHelper.display({
          id: "drag",
          header: "",
          cell: ({ row }) => <RowDragHandleCell rowId={row.id} />,
        }),
        columnHelper.display({
          id: "priority",
          header: "Priority",
          cell: ({ row }) => {
            const isFirst = row.index === 0;
            return (
              <div className="flex items-center gap-1.5 font-mono text-xs">
                <span className="font-bold text-sky-400">#{row.index + 1}</span>
                {isFirst && (
                  <span className="inline-flex items-center gap-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-1.5 py-0.5 rounded-full">
                    <Zap className="size-2.5" />
                    Next
                  </span>
                )}
              </div>
            );
          },
        }),
        columnHelper.accessor("playerName", {
          header: "Player Name",
          cell: ({ row }) => (
            <span className="font-semibold text-white">{row.original.playerName}</span>
          ),
        }),
        columnHelper.accessor("position", {
          header: "Position",
          cell: ({ row }) => (
            <span className="text-stone-300">{row.original.position?.join(", ")}</span>
          ),
        }),
        columnHelper.accessor("team", {
          header: "Team",
          cell: ({ row }) => (
            <span className="text-stone-300">{row.original.team}</span>
          ),
        }),
        columnHelper.accessor("age", {
          header: "Age",
          cell: ({ row }) => (
            <span className="text-stone-300">{row.original.age}</span>
          ),
        }),
        columnHelper.accessor("height", {
          header: "Height",
          cell: ({ row }) => (
            <span className="text-stone-300">{row.original.height}</span>
          ),
        }),
        columnHelper.accessor("weight", {
          header: "Weight",
          cell: ({ row }) => (
            <span className="text-stone-300">{row.original.weight}</span>
          ),
        }),
        columnHelper.accessor("throws", {
          header: "Throws",
          cell: ({ row }) => (
            <span className="text-stone-300">{row.original.throws}</span>
          ),
        }),
        columnHelper.accessor("bats", {
          header: "Bats",
          cell: ({ row }) => (
            <span className="text-stone-300">{row.original.bats}</span>
          ),
        }),
        columnHelper.display({
          id: "actions",
          header: "Actions",
          cell: ({ row }) => {
            const player = row.original;
            const index = row.index;

            return (
              <div className="flex items-center justify-end gap-1">
                {/* Mobile touch accessible reorder buttons */}
                <div className="flex items-center gap-0.5">
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={index === 0}
                    onClick={() => movePlayer(index, -1)}
                    className="h-7 w-7 p-0 text-stone-400 hover:text-white disabled:opacity-30 cursor-pointer"
                    title="Move Up"
                  >
                    <ChevronUp className="size-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={index === data.length - 1}
                    onClick={() => movePlayer(index, 1)}
                    className="h-7 w-7 p-0 text-stone-400 hover:text-white disabled:opacity-30 cursor-pointer"
                    title="Move Down"
                  >
                    <ChevronDown className="size-3.5" />
                  </Button>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-white/10 text-stone-300 hover:text-white cursor-pointer">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-slate-900 border border-white/15 text-white shadow-xl min-w-[130px]" align="end">
                    <DropdownMenuItem
                      onClick={() => moveToTop(index)}
                      disabled={index === 0}
                      className="cursor-pointer hover:bg-white/10 focus:bg-white/10 text-sky-300"
                    >
                      <ArrowUpToLine className="size-3.5 mr-1.5" />
                      Move to Top
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setConfirmDraftPlayer(player)}
                      className="cursor-pointer hover:bg-emerald-500/20 focus:bg-emerald-500/20 text-emerald-300 font-medium"
                    >
                      Draft Now
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => removePlayerFromQueue(player)}
                      className="cursor-pointer hover:bg-rose-500/20 focus:bg-rose-500/20 text-rose-300"
                    >
                      Remove
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            );
          },
        }),
      ]),
    [data],
  );

  const table = useAppTable({
    columns: queueColumns,
    data,
    enableRowSelection: true,
  });

  // reorder rows after drag & drop
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = dataIds.indexOf(active.id);
    const newIndex = dataIds.indexOf(over.id);
    const newData = arrayMove(data, oldIndex, newIndex);
    setData(newData);

    const queueOrder = newData.map((player, index) => ({
      playerId: player.id,
      rank: index + 1,
    }));
    updateMyQueueOrder(queueOrder);
  }

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {}),
  );

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      sensors={sensors}
    >
      <table.AppTable>
        <div className="rounded-xl border border-white/10 bg-slate-950/60 overflow-hidden shadow-lg backdrop-blur-md">
          <div className="overflow-x-auto w-full">
            <Table>
              <TableHeader className="bg-slate-900/90 border-b border-white/15">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="border-b border-white/15 hover:bg-transparent">
                    {headerGroup.headers.map((header) => {
                      const isSecondary = SECONDARY_QUEUE_COLUMNS.has(header.column.id);
                      return (
                        <TableHead
                          key={header.id}
                          className={cn(
                            "text-stone-300 font-semibold text-xs py-3",
                            isSecondary && "hidden md:table-cell",
                          )}
                        >
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
                      <DraggableRow key={row.original.id} row={row} />
                    ))
                  ) : (
                    <TableRow className="hover:bg-transparent border-none">
                      <TableCell
                        colSpan={queueColumns.length}
                        className="h-44 text-center"
                      >
                        <div className="flex flex-col items-center justify-center gap-2 text-stone-400">
                          <div className="rounded-full bg-white/5 p-3 border border-white/10">
                            <ListOrdered className="size-6 text-stone-300" />
                          </div>
                          <p className="font-semibold text-sm text-stone-200">Your Queue is Empty</p>
                          <p className="text-xs text-stone-400 max-w-sm">
                            Add prospects from the draft board to build your custom priority list and enable automated drafting.
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </SortableContext>
              </TableBody>
            </Table>
          </div>
        </div>
      </table.AppTable>

      {/* Confirmation Dialog for Mobile Touch Safety */}
      <AlertDialog
        open={Boolean(confirmDraftPlayer)}
        onOpenChange={(open) => !open && setConfirmDraftPlayer(null)}
      >
        <AlertDialogContent className="bg-slate-950 border border-white/20 text-white max-w-sm sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-bold">
              Confirm Draft Selection
            </AlertDialogTitle>
            <AlertDialogDescription className="text-stone-300 text-sm">
              Are you sure you want to draft{" "}
              <strong className="text-white font-semibold">
                {confirmDraftPlayer?.playerName}
              </strong>
              {confirmDraftPlayer?.position && confirmDraftPlayer.position.length > 0
                ? ` (${confirmDraftPlayer.position.join(", ")})`
                : ""}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row justify-end gap-2 mt-2">
            <AlertDialogCancel className="border-white/20 bg-white/5 hover:bg-white/10 text-white cursor-pointer mt-0">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold cursor-pointer"
              onClick={async () => {
                if (confirmDraftPlayer) {
                  const player = confirmDraftPlayer;
                  setConfirmDraftPlayer(null);
                  await draftPlayer(player);
                }
              }}
            >
              Draft Player
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DndContext>
  );
}
