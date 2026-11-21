"use client";

import { useEffect, useRef } from "react";

// import UI
import { Avatar, AvatarImage, AvatarFallback } from "~/_components/ui/avatar";

// import Types
import { type QueueDraftPick } from "~/app/_features/drafts/utils/draft";
import { PickCountdownTimer } from "./PickClockTimer";
import { cn } from "~/lib/utils";

export default function DraftQueueList({
  draftQueue,
}: {
  draftQueue: QueueDraftPick[];
}) {
  const allPicks = draftQueue;
  const activePickRef = useRef<HTMLLIElement>(null);

  // Auto-scroll the active "on the clock" pick card into view
  useEffect(() => {
    if (activePickRef.current) {
      activePickRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [allPicks]);

  return (
    <div className="flex grow">
      <ul className="flex gap-2 py-1">
        {allPicks.map((pick) => {
          const isOnClock = pick.draft_pick.status === "on the clock";
          const isOverdue = pick.draft_pick.status === "overdue";

          return (
            <li
              key={pick.draft_pick.id}
              ref={isOnClock ? activePickRef : null}
              className="flex items-center shrink-0"
            >
              <div
                className={cn(
                  "flex flex-col rounded-lg transition-all shadow-sm",
                  isOnClock
                    ? "border-2 border-emerald-400 bg-emerald-500/15 ring-2 ring-emerald-400/30"
                    : isOverdue
                      ? "border border-rose-500/50 bg-rose-500/10"
                      : "border border-white/15 bg-white/5",
                )}
              >
                <div className="flex items-center gap-1.5 p-1.5 border-b border-white/10">
                  <span className="font-mono text-xs font-bold text-stone-300">
                    #{pick.draft_pick.pickNumber}
                  </span>
                  <Avatar className="size-6">
                    <AvatarImage src="/_assets/avatar.png" alt="Avatar" />
                    <AvatarFallback className="bg-slate-900 text-[10px] font-bold text-white border border-white/15">
                      {pick.team.abbreviation}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex items-center gap-1">
                    <p className="text-xs font-medium text-white max-w-[100px] truncate">
                      {pick.team.name}
                    </p>
                    {pick.team.autoDraftEnabled && (
                      <span
                        title="Auto-Draft Enabled"
                        className="text-amber-400 text-[10px] font-bold shrink-0"
                      >
                        ⚡
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex justify-center p-1 min-h-[22px] items-center">
                  {isOnClock ? (
                    <PickCountdownTimer targetDate={pick.draft_pick.clockEndsAt} />
                  ) : isOverdue ? (
                    <p className="text-[11px] font-semibold text-center text-rose-400">
                      Overdue
                    </p>
                  ) : (
                    <p className="text-xs text-center text-stone-500">&nbsp;</p>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
