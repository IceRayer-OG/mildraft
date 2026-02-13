"use client";
// import React & Nextjs
import { use } from "react";

// import UI
import { Avatar, AvatarImage, AvatarFallback } from "~/_components/ui/avatar";

// import Server Actions

// import Types
import { type QueueDraftPick } from "~/app/_features/drafts/utils/draft";

export default function DraftQueueList({
  draftQueue,
}: {
  draftQueue: Promise<QueueDraftPick[]>;
}) {
  const allPicks = use(draftQueue);
  // Add useActionState to determine on the clock

  return (
    <div className="flex grow">
      <ul className="flex gap-1">
        {allPicks.map((pick) => (
          <li key={pick.draft_pick.id} className="flex items-center">
            <div className="flex flex-col border border-gray-400 rounded-md">
              <div className="flex items-center gap-1 p-1 border-b">
                <p>{pick.draft_pick.pickNumber}:</p>
                <Avatar className="size-7">
                  <AvatarImage src="/_assets/avatar.png" alt="Avatar" />
                  <AvatarFallback className="bg-white text-xs text-black">
                    {pick.team.abbreviation}
                  </AvatarFallback>
                </Avatar>
                <p className="text-xs">{pick.team.name}</p>
              </div>
              <div className="w-full">
                {pick.draft_pick.status === "on the clock" ? ( 
                  <p className="text-xs text-center text-green-500">On the Clock</p>
                ) : 
                pick.draft_pick.status === "overdue" ? ( 
                  <p className="text-xs text-center text-red-500">Overdue</p>
                ) : 
                <p className="text-xs text-center ">&nbsp;</p>}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
