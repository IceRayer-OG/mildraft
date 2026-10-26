"use client";

import { Button } from "~/_components/ui/button";
import { ScrollArea, Scrollbar } from "@radix-ui/react-scroll-area";
import { CheckCircle2, Clock } from "lucide-react";

// Types
import { type QueueDraftPick } from "../utils/draft";

export default function DraftOrderList({
  draftOrderList,
  isCompleted = false,
}: {
  draftOrderList: QueueDraftPick[];
  isCompleted?: boolean;
}) {
  const draftPicks = draftOrderList;

  if (!draftPicks || draftPicks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center text-sm gap-2">
        {isCompleted ? (
          <>
            <CheckCircle2 className="size-6 text-emerald-400" />
            <p className="text-stone-300 font-medium">The draft has completed.</p>
            <p className="text-xs text-stone-400">All draft picks have been recorded.</p>
          </>
        ) : (
          <>
            <Clock className="size-6 text-amber-400" />
            <p className="text-stone-300 font-medium">Draft order not established.</p>
            <p className="text-xs text-stone-400">Add picks below to configure the draft order.</p>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="flex grow overflow-hidden">
      <ScrollArea className="w-full whitespace-nowrap overflow-y-auto">
        <ul className="flex grow flex-col gap-2 p-1">
          {draftPicks.map((draftPick) => (
            <li
              key={draftPick.draft_pick.id}
              className="flex items-center gap-4 p-2 rounded-md bg-white/5 border border-white/10"
            >
              <Button size="sm" variant="outline" className="h-7 text-xs border-white/15">
                Edit
              </Button>
              <span className="font-semibold text-xs px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
                #{draftPick.draft_pick.pickNumber}
              </span>
              <p className="text-sm font-medium text-white">{draftPick.team.name}</p>
              {draftPick.team.autoDraftEnabled && (
                <span
                  title="Auto-Draft Enabled"
                  className="text-amber-400 text-xs font-semibold px-1.5 py-0.5 rounded bg-amber-400/10 border border-amber-400/20"
                >
                  ⚡ Auto
                </span>
              )}
            </li>
          ))}
        </ul>
        <Scrollbar orientation="vertical" />
      </ScrollArea>
    </div>
  );
}
